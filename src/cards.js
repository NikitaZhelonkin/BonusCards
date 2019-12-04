export default store => {
    store.on('@init', () => ({ cards: [ ] }))
  
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