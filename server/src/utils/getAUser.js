async function getAUser(Username, pool) {

    
    if (pool.connected) {
        let results = await pool.request()
            .input("inputUsername", Username)
            .execute("GetUser")
        
        

        return results.recordset[0];
    }

}

module.exports = getAUser;