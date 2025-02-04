const { select, input, checkbox } = require("@inquirer/prompts")
const fs = require("fs").promises

let mensagem = "Bem vindo(a)!"
let metas

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){}
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const mostrarMensagem = () => {
    console.clear()
    if(mensagem != ""){ 
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

async function start (){
    await carregarMetas()
    while(true){
        mostrarMensagem()
        await salvarMetas()
        const opcao = await select({
            message: "Menu >",
            choices: [{
                name: "Cadastrar meta",
                value: "cadastrar"
            },
            {
                name: "Listar metas",
                value: "listar"
            },
            {
                name: "Metas realizadas",
                value: "realizadas"
            },
            {
                name: "Metas abertas",
                value: "abertas"
            },
            {
                name: "Deletar metas",
                value: "deletar"
            },
            {
                name: "Sair",
                value: "sair"
            }
        ]
        })

        const cadastrarMeta = async () => {
            const meta = await input({
                message: "Digite a meta:"
            })

            if(meta.length == 0){
                console.log("A meta não pode ser vazia")
                return
            }

            metas.push({
                value: meta,
                checked: false
            })

            mensagem = "Meta cadastrada com sucesso"
        }

        const listarMetas = async () => {
            if(metas.length == 0){
                console.log("Não existe metas cadastradas")
                return
            }
            const respostas = await checkbox({
                message: "Use a seta para mudar a meta, marcando e desmarcando",
                choices: [...metas]
            })

            metas.forEach((m) => {
                m.checked = false
            })

            if(respostas.length == 0){
                console.log("Nenhuma meta selecionada")
                return
            }
            

            respostas.forEach((resposta) => {
                const meta = metas.find((m) => {
                    return m.value == resposta
                })
                meta.checked = true
            })

            mensagem = "Meta(s) concluida(s)"
        }

        const metasRealizadas = async () => {
            const realizadas = metas.filter((meta) => {
                return meta.checked == true
            })

            if(realizadas.length == 0 ){
                console.log("Não existe mestas realizadas")
                return
            }

            await select({
                message: "Metas realizadas " + realizadas.length,
                choices: [...realizadas]
            })
            console.log(realizadas)
        }

        const metasAbertas = async () => {
            const abertas = metas.filter((meta) => {
                return meta.checked == false
            })

            if(abertas.length == 0 ){
                console.log("Não existe mestas abertas")
                return
            }

            await select({
                message:"Metas abertas " + abertas.length,
                choices: [...abertas]
            })
        }

        const deletarMetas = async () => {
            const metasDesmarcadas = metas.map((meta) => {
                return { value: meta.value, checked: false}
            })
            const itensADeletar = await checkbox({
                message: "Selecione um item para deletar",
                choices: [...metasDesmarcadas]
            })

            if(itensADeletar.length == 0){
                console.log("Nenhum item deletado")
                return
            }

            itensADeletar.forEach((item) => {
                metas = metas.filter((meta) => {
                    return meta.value != item
                })
            })

            mensagem = itensADeletar.length + " Meta(s) deletada(s) com sucesso"
        }

        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
            break
            case "listar":
                await listarMetas()
            break
            case "realizadas":
                await metasRealizadas()
            break
            case "abertas":
                await metasAbertas()
            break
            case "deletar":
                await deletarMetas()
            break
            case "sair":
                console.log("Até a proxima!")
                return
        }
    }
}

start()