export default store => {
    store.on('@init', () => ({ cards: [ 
            {	
                id : 1,
                name : 'Карусель',
                number: 123213221312321
                
            },
            {
                id : 2,
                name : 'Mвидео',
                number: 123213221312321,
                
            },
            {
                id : 3,
                name : 'Ашан',
                number: 123213221312321,
            },
            {
                id : 4,
                name : 'Магнит',
                number: 123213221312321,
            }
        ] 
    }))
  
    store.on('cards/add', ({ cards }, card) => {
        card.id = cards.length + 1
        return { cards: cards.concat([card]) }
    })

    store.on('cards/delete', ({ cards }, id) => {
        return { cards: cards.filter((card) => card.id !== id) }
    })

    store.on('cards/edit', ({ cards }, editCard ) => {
        let newCards = cards.map((card) => {
			if (card.id === editCard.id) {
				card = editCard
			}
			return card
		})
		return { cards : newCards }
    })
  }