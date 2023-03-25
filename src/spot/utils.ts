// Decision regarding the way of calculating
export const decisionOfEvaluating = (
  price: number,
  inputAmount: number,
  indexOfInputCurrency: number,
) =>  {
  return indexOfInputCurrency === 0
    ? inputAmount * price
    : inputAmount / price;
}
