 
 
export const extractMisconception = (output) => {
  return{
    title: output.title,
    frequency: output.frequency,
    isCore: output.isCore,
    example: output.example,
    summary: output.summary,
    reasoning: output.aiReasoning,
    successIndicators: output.successIndicators,

  }
}

 export const scoreMisconception = (output) => {
  

}
 