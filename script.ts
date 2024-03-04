interface Veiculo{
    nome: string,
    placa: string,
    entrada: Date,
}

(function(){

    const $ = (query: string) : HTMLInputElement | null => document.querySelector(query);  
    
    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000)
        const sec = Math.floor((mil % 60000) / 1000)
        return `${min}m e ${sec}s`
    }

    function patio(){

        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : []
        }

        function salvar(carros: Veiculo[]){
            localStorage.setItem('patio', JSON.stringify(carros))
        }

        function adicionar(carro: Veiculo, _salvar?: boolean){
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${carro.nome}</td>
                <td>${carro.placa}</td>
                <td>${carro.entrada}</td>
                <td>
                    <button class="delete" data-placa="${carro.placa}">x</button>
                </td>
            `

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa)
            })

            $('#patio')?.appendChild(row)

            if(_salvar){
                salvar([...ler(), carro])
            }
        }

        function remover(placa: string){
            const { nome, entrada} = ler().find(veiculo => veiculo.placa === placa)
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime())

            if(!confirm(`O veiculo ${nome} ficou por ${tempo}. Deseja encerrar?`)){
                return
            }

            salvar(ler().filter(veiculo => veiculo.placa !== placa))
            render()
        }

        function render(){
            $('#patio')!.innerHTML = ''

            const patio = ler()
            if(patio.length){
                patio.forEach(veiculo => adicionar(veiculo))
            }
        }

        return { ler, adicionar, remover, salvar, render }
    }

    patio().render()

    $('#cadastrar')?.addEventListener('click', () => {

        const nome = $('#nome')?.value
        const placa = $('#placa')?.value

        if( !nome || !placa ){
            alert('Os campos nome e placa são obrigatórios')
            return
        }

        patio().adicionar({ nome, placa, entrada: new Date() }, true)

    })

})()