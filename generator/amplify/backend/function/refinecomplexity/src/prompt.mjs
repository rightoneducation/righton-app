import { z } from "zod";

// CZI
export const systemPromptLabel = 'You are an expert in grammar and literacy.';

// CZI
export const userPromptLabel = `
I am going to give you a text, and I need you to look through the text sentence-by-sentence and classify each sentence as either

When analyzing each sentence, think through the structure and use the following categories:
1. Simple Sentences: Sentences that contain only one independent clause and no dependent clauses. This includes simple sentences with relative clauses that may look like basic complex sentences (e.g. "Fast fashion is when stores sell clothes that are cheap and trendy.")
2. Compound Sentences: Sentences that consist of two or more independent clauses joined by a coordinating conjunction (e.g., "and," "or," "but").
3. Basic Complex Sentences - Sentences with exactly one independent clause and at one dependent (subordinate) clause.
4. Advanced Complex Sentences - Sentences with two or more of any of those following (can include a mix, doesn't have to be two of the same type) subordinate phrases, clauses, transition words, or any other meaningful "interruptions" to the flow of the sentence (like not-only-but-also constructions, dashes, semicolons, and lengthy appositives). A sentence can be advanced complex if it has just one subordinate phrase or clause alongside a transition phrase, like: "For example, the British favored trade with Hong Kong, assuming favorable trade conditions." 

After categorizing each sentence, summarize by counting how many sentences belong to each category. Let’s go through some examples to clarify.

Examples of Simple Sentences:
* "The colonies were founded by people from different countries, including Britain, France, Spain, the Netherlands, and Sweden." Simple sentence with a compound subject.
* "Universalizing religions, on the other hand, try to spread their beliefs to people from all over the world." Simple sentence with a straightforward independent clause.
* "For example, Voudon (Voodoo) combines elements of African gods with Catholic saints." Simple sentence; the introductory "for example" does not add a dependent clause (although "for example" does count as a transition phrase)
* "This book is about how the government should be run in an Islamic country." Simple sentence with a relative clause; does not add an independent event.
* "Japan has four main islands: Hokkaido, Honshu, Shikoku, and Kyushu, along with many smaller islands." Simple sentence with a list; no additional clause structure.

Examples of Compound Sentences:
* "She could speak several languages and studied a range of subjects, including philosophy, oratory, and mathematics." Compound sentence; two independent clauses connected by "and."
* "He was intelligent and had a talent for persuasive speaking." Compound sentence with two independent clauses connected by "and."
* "They were isolated from each other and didn't have the same access to information or travel that we do today." Compound sentence with two independent clauses joined by "and."

Examples of Basic Complex Sentences:
* "They settled in different regions of the eastern United States, each with its own unique culture and economy." One dependent clause, "each with its own unique culture and economy."
* "Its establishment was officially declared on October 24, 1945, after the Charter of the United Nations was ratified by a majority, including the five permanent members of the future Security Council." One dependent clause, "after the Charter of the United Nations was ratified by a majority." The phrase "including the five permanent members of the future Security Council." is a participial phrase adding more information about "a majority."
* "These ideals were given concrete expression through various programs and specialized agencies, demonstrating the UN’s range of focus from educational initiatives to health and welfare."
One dependent clause, "demonstrating the UN’s range of focus..."

Examples of Advanced Complex Sentences:
* "They also brought diseases like smallpox, which spread quickly among the Incas who were not immune to these new illnesses." First dependent clause "which spread quickly among the Incas," and a nested dependent clause "who were not immune to these new illnesses."
* "They advanced their own national pride, economic interests, and political competition as they vied for control over vast territories, establishing their dominance through exploitation of resources and exercising control over local populations." Two dependent clauses, "as they vied for control over vast territories" and "establishing their dominance through exploitation of resources..."
* "He was a foundational figure in the development of the artistic genre known as Jazz Poetry, which combined the structures of jazz music with the poetic form, providing a voice for the Black experience in America"
* "Through his writings, Hughes also played a significant role in the civil rights movement, employing his work as a platform to advocate for equity and justice."
* "He favored meritocracy over aristocracy, often promoting individuals based on their abilities rather than their birth status, influencing governance models in the lands that he controlled."
* "Over the years, it evolved and, at times, even shifted its focus."
* "Its legacy is controversial, seen by many as a period of intolerance and persecution, while some historians view it as a complicated system that was at times more moderate than its reputation suggests."
* "They operated in secret, risking their lives to relay messages and reports back to their own military commanders, using various clandestine methods such as coded messages, hidden compartments in everyday objects, and even invisible ink."

Here is the text:
[BEGIN TEXT]
{text}
[END TEXT]

IMPORTANT: Your response should be a single JSON object with the following structure. Do not produce anything outside of the JSON object. 
`;

export const structuredResponseLabel = z.object({
  reasoning: z.string()
    .describe("your reasoning as you read through the text"),

  num_sentences: z.number().int()
    .describe("number of sentences in the generated text"),

  num_simple_sentences: z.number().int()
    .describe("number of simple sentences in the generated text"),

  num_compound: z.number().int()
    .describe("number of compound sentences in the generated text"),

  num_basic_complex: z.number().int()
    .describe("number of basic complex sentences in the generated text"),

  num_advanced_complex: z.number().int()
    .describe("number of advanced complex sentences in the generated text"),

  percentage_simple: z.number()
    .describe("percentage of all sentences that are simple"),

  percentage_compound: z.number()
    .describe("percentage of all sentences that are compound"),

  percentage_basic_complex: z.number()
    .describe("percentage of all sentences that are basic complex"),

  percentage_advanced_complex: z.number()
    .describe("percentage of all sentences that are advanced complex"),
});

// CZI
export const systemPromptAssign = 'You are a helpful assistant.';

// CZI
export const userPromptAssign = `
  Your job is to rate the complexity of a text given some statistics about its sentences.

  Make sure your answer is one of ["Slightly Complex," "Moderately Complex," "Very Complex", "Exceedingly Complex"] given the guidelines in the rubric below.

  [BEGIN RUBRIC]
  Slightly Complex: A text is in the Slightly Complex bucket if it has at least 50% simple sentences. If it doesn't, the text is a higher level of complexity. If the % of simple sentences is >= 50% and the % of compound sentences is >= 20%, the text is Moderately Complex, otherwise, the text is Slightly Complex. Slightly Complex texts NEVER have advanced complex sentences — the presence of an advanced complex sentence always leads to a higher level of complexity than Slightly.

  For Moderately Complex: These texts can take on any distribution of sentence types as long as there aren't more than 2 advanced complex sentences and as long as there aren't so many simple sentences that the text becomes Slightly Complex. That means Moderately Complex texts may have many simple sentences (although not so many that the text is Slightly Complex), compound sentences, and/or basic complex sentences. It's also possible for a moderately complex text to contain one or two advanced complex sentences, as long as there aren't more than 2. If there are more than 2, then the text is either Very or Exceedingly complex.

  Very Complex: These texts contain 3 or more advanced complex sentences (unless the percentage of advanced complex sentences is >= 65)%, in which case the text becomes Exceedingly Complex). They may still contain many simple, compound, and basic complex sentences, but a text is not Very Complex unless there are 3 or more advanced complex sentences.

  Exceedingly Complex: These texts have 65%+ of their sentences being advanced complex sentences. 
  [END RUBRIC]

  [BEGIN STATISTICS]
  {statistics}
  [END STATISTICS]

  IMPORTANT: Your response should be a single JSON object with the following structure. Do not produce anything outside of the JSON object. 
`;

export const structuredResponseAssign = z.object({
  reasoning: z.string()
    .describe("Your detailed reasoning"),

  answer: z.string()
    .describe("your answer"),
});
