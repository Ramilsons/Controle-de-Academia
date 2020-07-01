//essa pagina está sendo responsavel por exportar as funçôes de crud
const fs = require('fs')
const data = require('../data.json')
const { toNamespacedPath } = require('path')
const { age, date } = require('../utils')
const { dataAtual } = require('../utils')


//index
exports.index = function(req, res){
    return res.render("members/index", {members: data.members})
}

//show = moostrar
exports.show = function(req, res){
    const { id } = req.params

    //achei um instrutor
    //metodo find proucra dentro do array através de uma função
    const foundMember = data.members.find(function(member){
        //retorn true se o id do parametro é igual ao do data.json
        return id == member.id
    })
    // se nao achar instrutor
    if(!foundMember) return res.send("Member not found!")

   
    const member = {
        //vai colocar tudo o que tem no foundMember
        ...foundMember,
        //esses dados abaixo vamos corrigir

        //chamando a funçao age passando o nascimento como parametro
        birth: date(foundMember.birth).birthDay

    }

    //se achar o instrutor
    return res.render("members/show", {member:member})
}

exports.create = function(req, res){
        return res.render('members/create')   
}
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
    
    //o birth sera alterado para milessegundos
    birth = Date.parse(req.body.birth)
    // e  o id sao tratados aqui, por isso nao está dentro do let
    let id=1
    const lastMember = data.members[data.members.length-1]
    
    if (lastMember){
        id = lastMember.id+1
    }

    data.members.push({
        id,
        ...req.body,
        birth
    })


    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("Houve um erro!")
        }else{
            return res.redirect("/members")
        }
    })

    //return res.send(req.body)
}

//editar
exports.edit = function(req, res){
    const { id } = req.params
    value="{{member.gender}}"
    const foundMember = data.members.find(function(member){
        //retorn true se o id do parametro é igual ao do data.json
        return id == member.id
    })
    // se nao achar instrutor
    if(!foundMember) return res.send("Member not found!")
    
    
    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

  

    return res.render('members/edit', {member})
}


exports.put = function(req, res){
    const { id } = req.body
    let index = 0
    //achei um instrutor
    //metodo find proucra dentro do array através de uma função
    const foundMember = data.members.find(function(member, foundIndex){
        //retorn true se o id do parametro é igual ao do data.json
        if (id == member.id){
            index = foundIndex
            return true
        }
    })
    // se nao achar instrutor
    if(!foundMember) return res.send("Member not found!")


    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        //para forçar ele a salvar como numero e nao string
        id: Number(req.body.id)
    }
    //index = posiçao correta no array
    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Erro de escrita")

        return res.redirect(`/members/${id}`)
    })
}

//delete
exports.delete = function(req, res){
    const {id} = req.body

    //filter para filtrar o id, o que for diferente do id continua no filteredMembers
    //o id selecionado nao entra no filteredMembers
    const filteredMembers = data.members.filter(function(member){
        return member.id != id 
    })
    //aqui estamos sobrescrevendo
    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data,null,2),function(err){
        if(err) return res.send("erro de escrita")

        return res.redirect("/members")
    })
}