import { Error as ServerError } from "grpc-web";
import {
  QueryAllBalancesRequest,
  QueryAllBalancesResponse,
} from "@provenanceio/wallet-utils/lib/proto/cosmos/bank/v1beta1/query_pb";
import { QueryClient as BankQueryClient } from "@provenanceio/wallet-utils/lib/proto/cosmos/bank/v1beta1/query_grpc_web_pb";
import { PageRequest } from "@provenanceio/wallet-utils/lib/proto/cosmos/base/query/v1beta1/pagination_pb";

export const getAccountBalances = (address: string, serviceAddress: string) => {
  const pageRequest = new PageRequest();
  pageRequest.setOffset(0);
  pageRequest.setLimit(1000);
  pageRequest.setCountTotal(true);
  const bankRequest = new QueryAllBalancesRequest();
  bankRequest.setAddress(address);
  bankRequest.setPagination(pageRequest);
  return new Promise((resolve, reject) => {
    new BankQueryClient(serviceAddress, null).allBalances(
      bankRequest,
      null,
      (error: ServerError, response: QueryAllBalancesResponse) => {
        if (error)
          reject(
            new Error(
              `bankQuery.allBalances error: Code: ${error.code} Message: ${error.message}`
            )
          );
        else {
          // console.log(JSON.stringify(response.toObject()));
          resolve(response.toObject());
        }
      }
    );
  }) as unknown as QueryAllBalancesResponse.AsObject;
};
