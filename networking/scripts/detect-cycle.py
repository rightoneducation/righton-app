#!/usr/bin/env python3
"""
Detect CloudFormation nested-stack cycles in the compiled Amplify GraphQL API,
and report the slot-0 (auth) wiring of the gameSessionBy* index resolvers.

Usage:
  python3 scripts/detect-cycle.py [path-to-build-dir]

Default build dir: amplify/backend/api/mobile/build

Why slot-0 matters: the GameSession<->Question circular dependency is created
when gameSessionByCode / gameSessionByState authorize via Question's auth
function (a cross-stack Ref) instead of GameSession's own. This script prints
which one each resolver uses so we can tell instantly whether a change severed
the edge -- without doing a full `amplify push`.
"""
import json
import sys
import os

BUILD = sys.argv[1] if len(sys.argv) > 1 else "amplify/backend/api/mobile/build"
ROOT_TEMPLATE = os.path.join(BUILD, "cloudformation-template.json")


def collect_stack_refs(obj, found):
    """Walk a parameters blob and collect every nested-stack logical id it references."""
    if isinstance(obj, dict):
        if "Fn::GetAtt" in obj:
            ga = obj["Fn::GetAtt"]
            if isinstance(ga, list) and ga:
                found.add(ga[0])
        if "Ref" in obj and isinstance(obj["Ref"], str):
            # parameter names embed the source stack: referencetotransformerrootstack<Stack>NestedStack...
            m = obj["Ref"]
            for s in ("GameSession", "Question", "Team", "TeamMember", "TeamAnswer", "User"):
                if f"stack{s}NestedStack" in m:
                    found.add(s)
        for v in obj.values():
            collect_stack_refs(v, found)
    elif isinstance(obj, list):
        for v in obj:
            collect_stack_refs(v, found)


def build_edges(template):
    res = template["Resources"]
    stacks = {k for k, v in res.items() if v.get("Type") == "AWS::CloudFormation::Stack"}
    edges = {}
    for name in stacks:
        found = set()
        collect_stack_refs(res[name].get("Properties", {}).get("Parameters", {}), found)
        edges[name] = {f for f in found if f in stacks and f != name}
    return edges


def find_cycles(edges):
    cycles = []
    seen = set()

    def dfs(node, path):
        for nb in edges.get(node, ()):
            if nb in path:
                cyc = path[path.index(nb):] + [nb]
                key = frozenset(cyc)
                if key not in seen:
                    seen.add(key)
                    cycles.append(cyc)
            elif nb not in path:
                dfs(nb, path + [nb])

    for n in edges:
        dfs(n, [n])
    return cycles


def slot0_origin(build_dir, stack, resolver):
    """Return 'GameSession' (same-stack, good) or 'Question' (cross-stack, the cycle) for slot 0."""
    path = os.path.join(build_dir, "stacks", f"{stack}.json")
    try:
        t = json.load(open(path))
    except FileNotFoundError:
        return "(stack file missing)"
    r = t["Resources"].get(resolver)
    if not r:
        return "(resolver missing)"
    fns = r["Properties"].get("PipelineConfig", {}).get("Functions", [])
    if not fns:
        return "(no pipeline functions)"
    blob = json.dumps(fns[0])
    if "Question" in blob:
        return "Question  <-- CROSS-STACK (cycle edge present)"
    if "getGameSession" in blob or "GameSession" in blob:
        return "GameSession  <-- same-stack (no edge)"
    return f"other: {blob[:80]}"


def main():
    if not os.path.exists(ROOT_TEMPLATE):
        print(f"!! {ROOT_TEMPLATE} not found. Run `amplify api gql-compile` first.")
        sys.exit(2)
    template = json.load(open(ROOT_TEMPLATE))
    edges = build_edges(template)

    gs = sorted(edges.get("GameSession", []))
    q = sorted(edges.get("Question", []))
    print("=== Stack edges ===")
    print(f"  GameSession depends on: {gs}")
    print(f"  Question    depends on: {q}")

    cycles = find_cycles(edges)
    print("\n=== Cycles ===")
    if cycles:
        for c in cycles:
            print("  CYCLE: " + " -> ".join(c))
    else:
        print("  none")

    print("\n=== Index-resolver slot-0 (auth) origin ===")
    print(f"  gameSessionByCode : {slot0_origin(BUILD, 'GameSession', 'QuerygameSessionByCodeResolver')}")
    print(f"  gameSessionByState: {slot0_origin(BUILD, 'GameSession', 'QuerygameSessionByStateResolver')}")

    print("\nRESULT:", "CYCLE PRESENT ❌" if cycles else "NO CYCLE ✅")
    sys.exit(1 if cycles else 0)


if __name__ == "__main__":
    main()
