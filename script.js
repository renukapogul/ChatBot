const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler")
const chatbotCloseBtn=document.querySelector(".close-btn")

let userMessage;
const API_KEY="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";

const createChatLi=(message,className)=>
{
    //create a chat <li> element with passed message and className
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing" ? `<p></p>`:`<span><i class="fa-solid fa-robot"></i>smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;

}

const generateResponse=(incomingChatLi) =>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions={
        method:"POST",
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            messages : [{role:"user", content:userMessage}]
        })
    }

    fetch(API_URL,requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.textContent = "Oops! something went wrong. Please try again."
    }
    ).finally(()=>   chatbox.scrollTo(0,chatbox.scrollHeight)
    )
}

const handleChat=()=>{
    userMessage= chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";

    //append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight)
    setTimeout(() => {
        //display "thinking.." message while waiting for the response
        const incomingChatLi=createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight)

        generateResponse(incomingChatLi);
    }, 600);
}
chatbotCloseBtn.addEventListener("click", ()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", ()=>document.body.classList.toggle("show-chatbot"));


sendChatBtn.addEventListener("click",handleChat);
