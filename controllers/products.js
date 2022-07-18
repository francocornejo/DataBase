class products{
    constructor(config, table){
        try{
            this.table = table;
            this.config = config;
            config.schema.hasTable(table).then(exists => {
                if (!exists) {
                    return config.schema.createTable(table, tab => {
                        tab.increments('id').notNullable().primary();
                        tab.string('title', 100).notNullable();
                        tab.string('thumbnail').notNullable();
                        tab.float('price').notNullable();
                    })
                }})
        }catch(err){
                console.log(err)
        }
    }
        
        async getAll (){

            let rows= await this.config.from(this.table).select("*")
            
            rows.forEach((article)=>{ console.log(`${article['id']}`)})
            
            return rows
        }

        async add ( title, price, thumbnail){

            const datos = {
                title,
                price,
                thumbnail,
            }

            const product= await this.config.from(this.table).insert(datos)

            return product
        }
    }

module.exports = products
