import { shopifyFetch } from "./shopify"

export async function createCart() {
  return shopifyFetch({
    query: `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `,
  })
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  return shopifyFetch({
    query: `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        featuredImage {
                          url
                        }
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  })
}

