// Decision regarding the way of calculating
export const decisionOfEvaluating = async (
  price: number,
  inputAmount: number,
  indexOfInputCurrency: number,
) =>  {
  return indexOfInputCurrency === 0
    ? inputAmount * price
    : inputAmount / price;
}
