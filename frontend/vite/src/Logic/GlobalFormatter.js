export default class GlobalFormatter {
  static gameEndDateBlurb(endDate) {
    const curr = new Date();
    if(curr < endDate){
      return `Open until ${endDate.toLocaleString()}`;
    } else {
      return `Game ended at  ${endDate.toLocaleString()}`
    }
  }
}