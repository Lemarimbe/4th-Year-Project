async function getAUser(Username, pool) {

    
    if (pool.connected) {
        let results = await pool.request()
            .input("inputUsername", Username)
            .execute("GetUser")
        
        console.log(results.recordset[0])

        return user
    }

}

module.exports = getAUser;