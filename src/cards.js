
import firebase from './firebase'

export default store => {
    store.on('@init', () => ({ cards: [] }))

    store.on('cards/save', ({ cards }, { cardsToSave }) => {
        return { cards: cardsToSave }
    })

    store.on('cards/add', ({ cards }, card) => {
        card.id = cards.length + 1
        return { cards: cards.concat([card]) }
    })

    store.on('cards/delete', ({ cards }, id) => {
        return { cards: cards.filter((card) => card.id !== id) }
    })

    store.on('cards/api/get', ({ cards }, uid) => {
        const db = firebase.firestore();
        

        db.collection('cards').where("uid", "==", uid).get().then(function(querySnapshot) {
            
            const cardsToSave = querySnapshot.docs.map((doc)=>{
                return{
                    id : doc.id,
                    name: doc.data().name,
                    number :doc.data().number,
                    serviceId: doc.data().service_id,
                }
            })
        
            store.dispatch('cards/save', { cardsToSave })
        });

    })

    store.on('cards/api/add', ({ cards }, card) => {

        const db = firebase.firestore();
       
        
        db.collection('cards').add({
            uid: card.uid,
            name: card.name,
            number: card.number,
            service_id: card.serviceId
        }).then((cardRef)=>{
            card.id = cardRef.id
            console.log(card.id)
            const cardsToSave = cards.concat([card]);
            store.dispatch('cards/save', { cardsToSave })
        })
    })

    store.on('cards/api/delete', ({ cards }, id) => {
        
        const db = firebase.firestore();
       
        db.collection("cards").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
            const cardsToSave = cards.filter((card) => card.id !== id);
            store.dispatch('cards/save', { cardsToSave })
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    })
}