//essa pagina está sendo responsavel por exportar as funçôes de crud
const fs = require('fs')
const data = require('../data.json')
const { toNamespacedPath } = require('path')
const { age, date } = require('../utils')
const { dataAtual } = require('../utils')


//index
exports.index = function(req, res){
    return res.render("instructors/index", {instructors: data.instructors})
}

//show = moostrar
exports.show = function(req, res){
    const { id } = req.params

    //achei um instrutor
    //metodo find proucra dentro do array através de uma função
    const foundInstructor = data.instructors.find(function(instructor){
        //retorn true se o id do parametro é igual ao do data.json
        return id == instructor.id
    })
    // se nao achar instrutor
    if(!foundInstructor) return res.send("Instructor not found!")

   
    const instructor = {
        //vai colocar tudo o que tem no foundInstructor
        ...foundInstructor,
        //esses dados abaixo vamos corrigir

        //chamando a funçao age passando o nascimento como parametro
        age: age(foundInstructor.birth),
        //transformando o serviços quando tiver uma virgula, pois o usuario colocar "musculaçao, nataçao"
        //ou seja, o spli "quebra" quando achar uma vírgula e ajusta a posição de array. Nesse exemplo a musculao sera posiçao 0 no services e nataçao sera posiçao 01
        services: foundInstructor.services.split(","),
        //pegando a data de criação
        created_at: dataAtual(foundInstructor.created_at)
    }

    //se achar o instrutor
    return res.render("instructors/show", {instructor:instructor})
}

exports.create = (function(req, res){
        return res.render('instructors/create')
})

//create
exports.post = function(req, res){
    //object keys é um construtor que retorna um objeti. Nesse caso as chaves do body
    const keys = Object.keys(req.body)
    //para cada item do keys gere uma key
    for(key of keys){
        //estamos vendo se todas as chaves estao preenchidas
        if (req.body[key] == ""){
            return res.send('Por favor, preencha todos os campos')
        }
    }

        //desistruturando o objeto req.body
    let {avatar_url, birth, name, services, gender} = req.body
    
    //o birth sera alterado para milessegundos
    birth = Date.parse(birth)
    // o created e  o id sao tratados aqui, por isso nao está dentro do let
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })


    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("Houve um erro!")
        }else{
            return res.redirect("/instructors")
        }
    })

    //return res.send(req.body)
}

//editar
exports.edit = function(req, res){
    const { id } = req.params
    value="{{instructor.gender}}"
    const foundInstructor = data.instructors.find(function(instructor){
        //retorn true se o id do parametro é igual ao do data.json
        return id == instructor.id
    })
    // se nao achar instrutor
    if(!foundInstructor) return res.send("Instructor not found!")
    
    
    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

  

    return res.render('instructors/edit', {instructor})
}


exports.put = function(req, res){
    const { id } = req.body
    let index = 0
    //achei um instrutor
    //metodo find proucra dentro do array através de uma função
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        //retorn true se o id do parametro é igual ao do data.json
        if (id == instructor.id){
            index = foundIndex
            return true
        }
    })
    // se nao achar instrutor
    if(!foundInstructor) return res.send("Instructor not found!")


    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        //para forçar ele a salvar como numero e nao string
        id: Number(req.body.id)
    }
    //index = posiçao correta no array
    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Erro de escrita")

        return res.redirect(`/instructors/${id}`)
    })
}

//delete
exports.delete = function(req, res){
    const {id} = req.body

    //filter para filtrar o id, o que for diferente do id continua no filteredInstructors
    //o id selecionado nao entra no filteredInstructors
    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id 
    })
    //aqui estamos sobrescrevendo
    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data,null,2),function(err){
        if(err) return res.send("erro de escrita")

        return res.redirect("/instructors")
    })
}