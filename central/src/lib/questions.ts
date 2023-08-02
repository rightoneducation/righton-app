export const cloneQuestion = async (question: any) => {
  const result = (await API.graphql(graphqlOperation(CQ, { question }))) as {
    data: any;
  };
  return result.data.createQuestion;
};

export const updateQuestion = async (question: any) => {
  delete question.updatedAt;
  delete question.createdAt;
  const result = (await API.graphql(graphqlOperation(UQ, { question }))) as {
    data: any;
  };
  return result?.data?.updateQuestion;
};

export const listOfQuestions = async () => {
  const listedQuestions = (await API.graphql(
    graphqlOperation(listQuestions)
  )) as { data: any };
  return listedQuestions.data.listQuestions;
};

export const getQuestion = async (id: any) => {
  const result = (await API.graphql(graphqlOperation(GQ, { id }))) as {
    data: any;
  };
  return result.data;
};
