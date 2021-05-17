import { Ticket } from "../ticket";

describe('Tickets API #component', () => {
  describe('Ticket model', () => {

    test("implementation for optimistic concurrency control", async (done) => {
      // create an instance of a ticket
      const ticket = Ticket.build({
        title: 'movie',
        price: 50,
        userId: '123'
      })
      
      // save the ticket to the database
      await ticket.save()

      // fetch the ticket twice
      const firstInstance = await Ticket.findById(ticket.id)
      const secondInstance = await Ticket.findById(ticket.id)

      // make two separate changes to the tickets we fetched
      firstInstance!.set({ price: 20 })
      secondInstance!.set({ price: 10 })

      // save the first fetched ticket successfull
      await firstInstance!.save()

      // error saving the second fetched ticket
      try {
        await secondInstance!.save()
      } catch (error) {
        return done()
      }

      throw new Error('Should not reach this point')
    })

    test("incrementing the version number on multiple saves", async () => {
      // create an instance of a ticket
      const ticket = Ticket.build({
        title: 'talk',
        price: 60,
        userId: '123'
      })
      
      // save the ticket to the database
      await ticket.save()
      expect(ticket.version).toEqual(0)

      await ticket.save()
      expect(ticket.version).toEqual(1)

      await ticket.save()
      expect(ticket.version).toEqual(2)
    })
  })
})    