import { HostDataManagerAPIClient } from "../src/APIClients/datamanagers/HostDataManagerAPIClient"
import { Environment } from "../src/APIClients/interfaces/IBaseAPIClient"
import { ITeam } from "../src/Models"

// Regression cover for bug #2577: the host roster is appended to from onCreateTeam pushes, so a push
// lost while the socket was down left that team invisible for the rest of the session. resyncTeams
// refetches and reconciles; these assert it recovers lost teams without resurrecting deleted ones,
// plus cover for the adjacent handler/cleanup defects found in review.
describe("HostDataManagerAPIClient team resync", () => {
  const gameSessionId = "gs-1"
  const team = (id: string, score = 0): ITeam => ({ id, name: `Team ${id}`, score } as unknown as ITeam)

  // Builds a client with the subscription/network seams stubbed: create/update callbacks are
  // captured so tests can fire pushes by hand, and getGameSession returns the stated server roster.
  const buildClient = (serverTeams: ITeam[]) => {
    let pushCreate: (t: ITeam) => void = () => {}
    let pushUpdate: (t: ITeam) => void = () => {}
    const unsubscribe = jest.fn()
    const getGameSession = jest.fn().mockImplementation(async () => ({
      id: gameSessionId,
      currentState: "TEAMS_JOINING",
      teams: [...serverTeams],
    }))
    const gameSessionAPIClient: any = { getGameSession }
    const teamAPIClient: any = {
      subscribeCreateTeam: async (_id: string, cb: (t: ITeam) => void) => {
        pushCreate = cb
        return { unsubscribe }
      },
      subscribeUpdateTeam: async (_id: string, cb: (t: ITeam) => void) => {
        pushUpdate = cb
        return { unsubscribe }
      },
    }
    const client = new HostDataManagerAPIClient(
      Environment.Developing,
      gameSessionAPIClient,
      {} as any,
      teamAPIClient,
      {} as any,
      {} as any,
    )
    ;(client as any).gameSessionId = gameSessionId
    ;(client as any).gameSession = { id: gameSessionId, teams: [] }
    return {
      client,
      getGameSession,
      unsubscribe,
      pushCreate: (t: ITeam) => pushCreate(t),
      pushUpdate: (t: ITeam) => pushUpdate(t),
    }
  }

  // subscribe* methods are async under the hood; a macrotask flush lets the stubbed
  // subscription promises resolve so push handlers are wired before tests fire them.
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

  describe("resyncTeams", () => {
    it("recovers a team whose create push never arrived", async () => {
      // Server has 3 teams; the socket only ever delivered team-1 (the #2577 shape).
      const { client, pushCreate } = buildClient([team("1"), team("2"), team("3")])
      client.subscribeToCreateTeam(() => {})
      await flush()
      pushCreate(team("1"))
      expect(client.getGameSession()?.teams).toHaveLength(1)

      const result = await client.resyncTeams()

      expect(result?.changed).toBe(true)
      expect(result?.gameSession.teams.map((t) => t.id).sort()).toEqual(["1", "2", "3"])
    })

    it("does not resurrect a team the host deleted", async () => {
      // Server is authoritative for removals: team-2 was X'd out and is gone from the backend.
      const { client, pushCreate } = buildClient([team("1")])
      client.subscribeToCreateTeam(() => {})
      await flush()
      pushCreate(team("1"))
      pushCreate(team("2"))
      expect(client.getGameSession()?.teams).toHaveLength(2)

      const result = await client.resyncTeams()

      expect(result?.changed).toBe(true)
      expect(result?.gameSession.teams.map((t) => t.id)).toEqual(["1"])
    })

    it("keeps a team pushed while the refetch was in flight", async () => {
      // The fetch was served before team-2 existed; replacing the roster with it must not drop team-2.
      const { client, getGameSession, pushCreate } = buildClient([team("1")])
      client.subscribeToCreateTeam(() => {})
      await flush()
      pushCreate(team("1"))
      getGameSession.mockImplementationOnce(async () => {
        pushCreate(team("2"))
        return { id: gameSessionId, teams: [team("1")] }
      })

      const result = await client.resyncTeams()

      expect(result?.gameSession.teams.map((t) => t.id).sort()).toEqual(["1", "2"])
    })

    it("reports changed=false and skips nothing when the roster already matches", async () => {
      const { client, pushCreate } = buildClient([team("1"), team("2")])
      client.subscribeToCreateTeam(() => {})
      await flush()
      pushCreate(team("1"))
      pushCreate(team("2"))

      const result = await client.resyncTeams()

      expect(result?.changed).toBe(false)
      expect(result?.gameSession.teams).toHaveLength(2)
    })

    it("leaves currentState alone so a resync can't undo a phase advance", async () => {
      // The host drives game state itself and is authoritative for it; a resync landing after an
      // advance must not roll currentState back to whatever the server read returned.
      const { client } = buildClient([team("1")])
      ;(client as any).gameSession = { id: gameSessionId, currentState: "PHASE_2_DISCUSS", teams: [] }

      const result = await client.resyncTeams()

      expect(result?.gameSession.currentState).toEqual("PHASE_2_DISCUSS")
      expect(result?.gameSession.teams.map((t) => t.id)).toEqual(["1"])
    })

    it("returns null without fetching when init hasn't loaded a session yet", async () => {
      // Triggers (visibility/online/poll) can fire before init resolves; must be a clean no-op.
      const { client, getGameSession } = buildClient([team("1")])
      ;(client as any).gameSession = null

      await expect(client.resyncTeams()).resolves.toBeNull()
      expect(getGameSession).not.toHaveBeenCalled()
    })
  })

  describe("subscription handlers", () => {
    it("ignores a duplicate create push for a team resync already surfaced", async () => {
      // After a resync the socket may redeliver the same team; it must not double-count or re-render.
      const { client, pushCreate } = buildClient([team("1"), team("2")])
      const callback = jest.fn()
      client.subscribeToCreateTeam(callback)
      await flush()
      await client.resyncTeams()
      callback.mockClear()

      pushCreate(team("2"))

      expect(callback).not.toHaveBeenCalled()
      expect(client.getGameSession()?.teams).toHaveLength(2)
    })

    it("appends on an update push for a team missing from the roster (no teams[-1])", async () => {
      // An update can arrive for a team whose create push was lost; the old findIndex code wrote
      // teams[-1] and silently dropped it.
      const { client, pushUpdate } = buildClient([])
      const callback = jest.fn()
      client.subscribeToUpdateTeam(callback)
      await flush()

      pushUpdate(team("ghost", 5))

      const teams = client.getGameSession()?.teams as ITeam[]
      expect(teams.map((t) => t.id)).toEqual(["ghost"])
      expect(Object.keys(teams)).not.toContain("-1")
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it("replaces a team on update without mutating the previous roster array", async () => {
      const { client, pushCreate, pushUpdate } = buildClient([])
      client.subscribeToCreateTeam(() => {})
      client.subscribeToUpdateTeam(() => {})
      await flush()
      pushCreate(team("1", 0))
      const rosterBefore = client.getGameSession()?.teams as ITeam[]

      pushUpdate(team("1", 10))

      expect((client.getGameSession()?.teams as any)[0].score).toBe(10)
      expect((rosterBefore as any)[0].score).toBe(0)
    })
  })

  describe("cleanupSubscription", () => {
    it("unsubscribes subscriptions held as promises", async () => {
      // subscribe* is async, so the fields hold Promise<Subscription>; the old guard read
      // promise.unsubscribe (undefined) and silently leaked every socket.
      const { client, unsubscribe } = buildClient([])
      client.subscribeToCreateTeam(() => {})
      client.subscribeToUpdateTeam(() => {})
      await flush()

      client.cleanupSubscription()
      await flush()

      expect(unsubscribe).toHaveBeenCalledTimes(2)
    })
  })
})
