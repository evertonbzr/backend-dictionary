import { db } from "./drizzle";
import { words } from "./schema";
const seed = async () => {
  const wordsLoaded: Record<string, number> = await fetch(
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
  )
    .then((response) => response.json())
    .then((data) => data as Record<string, number>);

  const wordsArray = Object.keys(wordsLoaded).map((word) => ({ word }));

  const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const results: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const chunks = chunkArray(wordsArray, 1000);

  for (const chunk of chunks) {
    await db.insert(words).values(chunk);
  }

  console.log("Finished seeding words");
  process.exit();
};

seed();
