import { Query } from "../../../callApi";

export const getMember = (
  searchQuery: string | number,
  searchType: any = "id"
): Query => {
  let endpoint = "members/search?";

  switch (searchType) {
    case "id":
      endpoint += `id=${searchQuery}`;
      break;
    case "name":
      const [firstName, ...rest] = String(searchQuery).trim().split(" ");
      const lastName = rest.join(" "); // join remaining parts for last name
      endpoint += `firstName=${encodeURIComponent(firstName)}`;
      if (lastName) {
        endpoint += `&lastName=${encodeURIComponent(lastName)}`;
      }
      break;
    case "email":
      endpoint += `email=${encodeURIComponent(searchQuery)}`;
      break;
    case "phone":
      endpoint += `phone=${encodeURIComponent(searchQuery)}`;
      break;
    case "qrToken":
      endpoint += `qrToken=${encodeURIComponent(searchQuery)}`;
      break;
  }

  return {
    endpoint,
    method: "GET",
  };
};
