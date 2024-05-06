interface Address {
  country: string,
  street: string,
  city: string,
  state: string,
  zipcode: string
}

interface StringType {
  [propName: string]: string
}

export interface Contact {
  id: string,
  name: string,
  phoneNumbers: StringType,
  addresses: Address,
  emails: StringType
}

const jsonData: string = `
[
	{
		"id": "5c21433c-3c70-4253-a4b2-52b157be4167",
		"name": "Greg from accounting",
		"phoneNumbers": {
			"home": "+359(26)5948-0427"
		},
		"emails": {
			"main": "sailor.greg99@hotmail.co.jp"
		},
		"addresses": {
			"work": {
				"country": "Japan",
				"street": "127-1121, Hiyamizu",
				"city": "Rankoshi-cho Isoya-gun",
				"state": "Hokkaido",
				"zipcode": "02169"
			},
			"home": {
				"country": "Japan",
				"street": "343-1199, Tennodai",
				"city": "Abiko-shi",
				"state": "Chiba",
				"zipcode": "02169"
			}
		}
	},
	{
		"id": "4fe25947-ecab-489c-a881-e0057124e408",
		"name": "Coworker Fred",
		"phoneNumbers": {
			"mobile": "+81(56)4205-8516",
			"office": "+359(10)4094-9549",
			"home": "+52(54)6536-5876"
		},
		"emails": {
			"main": "yuki.fred@gmail.com"
		},
		"addresses": {
			"home": {
				"country": "EUA",
				"street": "4454 Steve Hunt Road",
				"city": "Miami",
				"state": "Florida",
				"zipcode": "33131"
			}
		}
	},
	{
		"id": "35b175ba-0a27-43e9-bc3f-cf23e1ca2ea7",
		"name": "Sister Monica",
		"phoneNumbers": {
			"office": "+65(77)4248-0921"
		},
		"emails": {
			"main": "usermonica01@outlook.com"
		},
		"addresses": {
			"home": {
				"country": "EUA",
				"street": "4529 Jehovah Drive",
				"city": "Waynesboro",
				"state": "Virginia",
				"zipcode": "22980"
			}
		}
	},
  {
		"id": "7f23057f-77bd-4568-ac64-e933abae9a09",
		"name": "Best friend Julia",
		"phoneNumbers": {
			"office2": "+1(22)2514-4183",
			"office": "+39(05)8263-6323",
			"home": "+31(47)1688-3562"
		},
		"emails": {
			"third": "contactforjulia@wolf.com",
			"main": "rick.julia@zipmail.com",
			"second": "juliarcs@outlook.com"
		},
		"addresses": {
			"home": {
				"country": "EUA",
				"street": "1116 Mahlon Street",
				"city": "Farmington Hills",
				"state": "Michigan",
				"zipcode": "48335"
			}
		}
	},
	{
		"id": "84edd1b9-89a5-4107-a84d-435676c2b8f5",
		"name": "Mom",
		"phoneNumbers": {
			"home": "+65(91)6788-9156"
		},
		"emails": {
			"main": "Sheyla.orton@hoppe.org"
		},
		"addresses": {
			"home": {
				"country": "EUA",
				"street": "2259 Sycamore Fork Road",
				"city": "Hopkins",
				"state": "Minnesota",
				"zipcode": "55343"
			}
		}
	},
	{
		"id": "8fb2bd75-9aec-4cc5-b77b-a95f06081388",
		"name": "Pizza and burgers",
		"phoneNumbers": {
			"main": "+81(78)8606-4615"
		},
		"emails": {
			"main": "pizzaandburgers.main@amazon.com",
			"second": "pizzaandburgers.store2@amazon.com"
		},
		"addresses": {
			"store 1": {
				"country": "EUA",
				"street": "3267 Mercer Street",
				"city": "San Diego",
				"state": "California",
				"zipcode": "92119"
			},
			"store 2": {
				"country": "EUA",
				"street": "2644 Arron Smith Drive",
				"city": "Thelma",
				"state": "Kentucky",
				"zipcode": "41260"
			},
			"store 3": {
				"country": "EUA",
				"street": "2221 Spruce Drive",
				"city": "Core",
				"state": "Pennsylvania",
				"zipcode": "26529"
			}
		}
	},
	{
		"id": "b621650d-4a81-4016-a917-4a8a4992aaef",
		"name": "Uncle Jeff",
		"phoneNumbers": {
			"mobile": "+31(14)1750-4453",
			"home": "+39(80)9464-0706"
		},
		"emails": {
			"main": "contactforjeff.now@yahoo.com"
		},
		"addresses": {
			"work": {
				"country": "Japan",
				"street": "210-1040, Okada",
				"city": "Chikushino-shi",
				"state": "Fukuoka",
				"zipcode": "48335"
			},
			"home": {
				"country": "Japan",
				"street": "237-1233, Ichihasama Shimmai",
				"city": "Kurihara-shi",
				"state": "Miyagi",
				"zipcode": "46231"
			}
		}
	}
]
`

export function getData(): Contact[] {
  return JSON.parse(jsonData);
}