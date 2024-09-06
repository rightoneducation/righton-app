import { IAPIClients, IGameTemplate } from "@righton/networking";
import {v4 as uuidv4} from 'uuid';

const fetchMoreGames = async (apiClients: IAPIClients, nextToken: string, setNextToken: (nextToken: string | null) =>void, setGames: any, setLoading: (loading:boolean)=> void, loading: boolean) => {
    console.log("in fetchmoregames");
    console.log("Next Token:", nextToken);

    if (apiClients && !loading) {
      setLoading(true);
      const response = await apiClients.gameTemplate.listGameTemplates(8, nextToken, null, null);
      if (response) {
        setGames((prevGames: any) => [
          ...prevGames,
          ...(response.gameTemplates.map((game) => ({ ...game, id: uuidv4() })) || [ ]),
        ]);
        setNextToken(response.nextToken || null);
      }
      setLoading(false);
    }
  };

// change when we have more
export default fetchMoreGames;

