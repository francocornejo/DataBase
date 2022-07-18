class messages{
    constructor(config, table){
        try{
            this.table = table;
            this.config = config;

            config.schema.hasTable(table).then(exists => {
                if (!exists) {
                    return config.schema.createTable(table, tab => {
                        tab.increments('id').notNullable().primary();
                        tab.string('email', 70).notNullable();
                        tab.string('date', 50);
                        tab.string('message').notNullable();
                    });
                }
            })}catch(err){
                console.log(err)
            } 
        }

        async addMessage( email, message ){

            const date = new Date().toLocaleString()

            const datos = {
                email,
                date,
                message
            } 

            const messages= await this.config.from(this.table).insert(datos)

            return messages 
        }

        async getMessages(){

            let rows= await this.config.from(this.table).select("*")

            rows.forEach((article)=>{ console.log(`${article['id']} ${article['email']} ${article['date']}: ${article['message']}`) })

            return rows
        }
}

module.exports = messages