function clicker(message: string): void{
    console.log(message)
}

const btn = document.querySelector('.clicker');
if(!!btn){
    btn.addEventListener('click', () => {
        clicker('Hello, I am TypeScript')
    })
}