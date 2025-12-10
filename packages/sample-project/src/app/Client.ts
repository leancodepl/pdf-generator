/*eslint-disable*/
import { CqrsClient as CQRS } from "@leancodepl/api-proxy"

export default function (cqrsClient: CQRS) {
  return {
    TestQueries: {
      TestQuery1: cqrsClient.createQuery<{}, { test: string }>("query1"),
    },
  }
}
