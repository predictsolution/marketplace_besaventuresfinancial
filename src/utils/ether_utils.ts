export function parseHexTo_decimal(hex: string) {
  return parseInt(hex);
}

export function parseBigintTo_number(bigint_input: string) {
  const getBigInt = BigInt(bigint_input);
  return Number(getBigInt);
}

export function reduceTotalOwners(
  owner_addresses: {
    result: string;
    status: string;
  }[]
) {
  if (typeof owner_addresses == 'undefined' || owner_addresses[0] === null) {
    return 0;
  }

  let ownerList: string[] = [];

  owner_addresses.map((current_address) => {
    const foundAddress = ownerList.find(
      (address: string) => address === current_address.result
    );

    if (!foundAddress) {
      ownerList.push(current_address.result);
    }
  });

  return ownerList.length;
}
