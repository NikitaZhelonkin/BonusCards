
import firebase from './firebase'

export default store => {

    store.on('@init', () => ({ cards: { loading: true, data: [] } }))

    store.on('cards/save', ({ cards }, { cardsToSave }) => {
        cards.data = cardsToSave;
        cards.loading = false;
        console.log("update cards");
        return { cards: cards }
    })


    store.on('cards/listen', ({ cards }, { uid }) => {
        const db = firebase.firestore();
        db.collection('cards').where("uid", "==", uid)
            .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
                console.log("onSnapshot ");

                store.dispatch('cards/api/get', uid)
            });
    })

    store.on('cards/api/get', ({ cards }, uid) => {
        const db = firebase.firestore();
        db.collection('cards').where("uid", "==", uid).get().then((snapshot) => {
            const cardsToSave = snapshot.docs.map((doc) => {
                return {
                    docId: doc.id,
                    uid: doc.data().uid,
                    id: doc.data().id,
                    name: doc.data().name,
                    number: doc.data().number,
                    serviceId: doc.data().service_id,
                }
            })
            store.dispatch('cards/save', { cardsToSave })

        })

    })


    store.on('cards/api/add', ({ cards }, card) => {
        const db = firebase.firestore();
        card.id = makeid(20);
        db.collection('cards').add({
            uid: card.uid,
            id: card.id,
            name: card.name,
            number: card.number,
            service_id: card.serviceId
        })
    })


    store.on('cards/api/delete', ({ cards }, card) => {
        const db = firebase.firestore();
        db.collection("cards").doc(card.docId).delete();
    })

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}