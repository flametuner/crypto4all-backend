require("dotenv").config();
import * as Polygon from './polygon'

const main = async () => {
  await Promise.all([Polygon.listenForEvents()])
}
const { ENV } = process.env
console.log(`running env ${ENV}`)

main()
