export default prefs => {
    prefs.on('@init', () => ({ prefs: {} }))

    prefs.on('prefs/set', ({ prefs }, pref) => {
        
        prefs[pref.key] = pref.value;
        return prefs;

    })

}