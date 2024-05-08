const stores = [
      {
            id: 1,
            title: "Barbearia Caballeros",
            locationImageUrl: "/location.png",
            locationUrl: "https://maps.app.goo.gl/loja1",
            address: "Rua da Loja 1, 123",
            phoneNumber: "(11) 1111-1111",
            whatsapp: "(11) 1111-1111",
            instagram: "@loja1",
            services: [
                  {
                        id: 1,
                        title: "Corte de Cabelo",
                        price: 30
                  },
                  {
                        id: 2,
                        title: "Barba",
                        price: 20
                  },
                  {
                        id: 3,
                        title: "Sobrancelha",
                        price: 15
                  },
                  {
                        id: 4,
                        title: "Corte de Cabelo + Barba",
                        price: 45
                  },
                  {
                        id: 5,
                        title: "Corte de Cabelo + Barba + Sobrancelha",
                        price: 55
                  },
                  {
                        id: 6,
                        title: "Descoloração",
                        price: 70
                  }
            ],
            additionalServices: [
                  {
                        id: 1,
                        title: "Sobrancelha",
                        price: 45
                  },
                  {
                        id: 2,
                        title: "Corte de Cabelo + Barba",
                        price: 50
                  },
            ],
            availableTimesForDay: {
                  "2024-05-01": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
                  "2024-05-02": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
            },
            users: [
                  {
                        id: 1,
                        type: "admin",
                        name: "João Roberto",
                        phoneNumber: "(11) 1 1111-1111",
                        password: "11111111",
                        photo: "/profile.svg",
                  },
                  {
                        id: 2,
                        type: "client",
                        name: "Roberto Campos",
                        phoneNumber: "(11) 1 1111-1111",
                        password: "33333333",
                        photo: "/profile.svg",
                  }
            ],
            appointments: [
                  {
                        id: 1,
                        storeId: 1,
                        userId: 2,
                        serviceId: 1,
                        additionalServiceId: 1,
                        date: "2024-03-01",
                        time: "09:00"
                  },
            ]
      },
      {
            id: 2,
            title: "Barbearia Torres",
            locationImageUrl: "/location.png",
            locationUrl: "https://maps.app.goo.gl/loja2",
            address: "Rua da Loja 2, 456",
            phoneNumber: "(11) 2222-2222",
            whatsapp: "(99) 99999-9999",
            instagram: "@loja2",
            services: [
                  {
                        id: 3,
                        title: "Corte de Cabelo",
                        price: 35
                  },
                  {
                        id: 4,
                        title: "Barba",
                        price: 25
                  },
            ],
            additionalServices: [
                  {
                        id: 1,
                        title: "Sobrancelha",
                        price: 25
                  },
                  {
                        id: 2,
                        title: "Corte de Cabelo + Barba",
                        price: 50
                  },
                  {
                        id: 3,
                        title: "Corte de Cabelo + Barba + Sobrancelha",
                        price: 60
                  }
            ],
            availableTimesForDay: {
                  "2024-03-01": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
                  "2024-03-02": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
                  "2024-03-04": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
            },
            users: [
                  {
                        id: 1,
                        type: "client",
                        name: "Roberto Almeida",
                        phoneNumber: "(11) 1 1111-1111",
                        password: "22222222",
                        photo: "/profile.svg",
                  },
                  {
                        id: 2,
                        type: "client",
                        name: "Roberto Campos",
                        phoneNumber: "(11) 1 1111-1111",
                        password: "33333333",
                        photo: "/profile.svg",
                  }
            ]
      },
      {
            id: 4,
            title: "Barbearia Alves",
            locationImageUrl: "/location.png",
            locationUrl: "https://maps.app.goo.gl/loja2",
            address: "Rua da Loja 2, 456",
            phoneNumber: "(11) 2222-2222",
            whatsapp: "(99) 99999-9999",
            instagram: "@loja2",
            services: [
                  {
                        id: 3,
                        title: "Corte de Cabelo",
                        price: 35
                  },
                  {
                        id: 4,
                        title: "Barba",
                        price: 25
                  },
            ],
            additionalServices: [
                  {
                        id: 1,
                        title: "Sobrancelha",
                        price: 25
                  },
                  {
                        id: 2,
                        title: "Corte de Cabelo + Barba",
                        price: 50
                  },
                  {
                        id: 3,
                        title: "Corte de Cabelo + Barba + Sobrancelha",
                        price: 60
                  }
            ],
            availableTimesForDay: {
                  "2024-03-01": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
                  "2024-03-02": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
                  "2024-03-04": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
            },
            users: [
                  {
                        id: 1,
                        type: "client",
                        name: "Roberto Almeida",
                        phoneNumber: "(11) 1 1111-1111",
                        password: "20/10/2000",
                        photo: "/profile.svg",
                  }
            ]
      },

];

export default stores;