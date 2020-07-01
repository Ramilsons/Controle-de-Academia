module.exports = {
    age: function(milissegundos) {
            //lógica para idade do instrutor
    //lembrando que só o ano nao dá pra saber a idade exata       //hoje em forma de data
        const today = new Date()
        //nascimento em forma de data
        const birthDate = new Date(milissegundos)

        //anos é = ano de hoje - ano de nascimento
        let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
        //mes é = mes de hoje - mes do ano
        //lembrando que janeiro é representado por 0 e dez por 11
        let month = today.getUTCMonth() - birthDate.getUTCMonth()
        
        //getDate pega o dia de 1-31...estamos usando esse if para nao der erro se o usuario vai fazer aniversario ainda este ano
        if((month < 0 || month == 0) && today.getDate() <= birthDate.getDate()){
            age = age - 1
        }

        return age
    },
   dataAtual: function(milissegundos){
    const hoje = new Date(milissegundos)
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth();
    let dia = hoje.getDate();

    return dia+"/"+(mes+1)+"/"+ano 
    },
    //para mostrar ao usuario corretamente no edit
    date: function(milissegundos){
        const date = new Date(milissegundos)
        
        const year = date.getUTCFullYear()
        //slice pega certos elementos da string, lembrando que começa  no 0
        //nesse caso estamos pegando os dois ultimos caracteres para nao dar erro se o mes for 012 ou 02
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }

    }
    
}