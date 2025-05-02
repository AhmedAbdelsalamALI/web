document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("chatbot-button").addEventListener("click", function () {
        document.getElementById("chatbot-container").style.display = "flex";
    });

    document.getElementById("close-chatbot").addEventListener("click", function () {
        document.getElementById("chatbot-container").style.display = "none";
    });

    document.getElementById("send-message").addEventListener("click", function () {
        sendMessage();
    });

    document.getElementById("chatbot-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

function isFoodRelated(message) {
    const foodKeywords = ["وصفة", "أكل", "طبخ", "مكونات", "تحضير", "وجبة", "فطور", "غداء", "عشاء", "مشروب", "سلطة", "حلوى", "كيك", "طعام", "مطبخ", "مقبلات", "شوربة", "سمبوسة", "معكرونة", "بيتزا"];
    const lowerMessage = message.toLowerCase();
    return foodKeywords.some(keyword => lowerMessage.includes(keyword));
}

function sendMessage() {
    const inputField = document.getElementById("chatbot-input");
    const message = inputField.value.trim();
    
    if (message === "") return;

    addMessage(message, "user-message");
    inputField.value = "";

    if (isFoodRelated(message)) {
        fetchRecipeFromGemini(message);
    } else {
        addMessage("🚫 بوت الأكل هنا! 🍕 أنا شاطر بس في الأسئلة عن الأكل والوصفات يا صديقي 😄 جرب تسألني مثلاً عن وصفة مكرونة أو حلوى! 🍰", "bot-message");
    }
}

function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.innerText = text;
    document.getElementById("chatbot-messages").appendChild(messageDiv);
    document.getElementById("chatbot-messages").scrollTop = document.getElementById("chatbot-messages").scrollHeight;
}

function addImageMessage(imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "صورة الوصفة";
    img.className = "bot-image-message";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.marginTop = "8px";
    document.getElementById("chatbot-messages").appendChild(img);
    document.getElementById("chatbot-messages").scrollTop = document.getElementById("chatbot-messages").scrollHeight;
}

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    speechSynthesis.speak(utterance);
}

function getImageForRecipe(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("بيتزا")) {
        return "https://images.unsplash.com/photo-1594007654729-408cb7dce065?auto=format&fit=crop&w=800&q=80";
    } else if (lowerMessage.includes("كيك")) {
        return "https://images.unsplash.com/photo-1604917869287-5166d3d24ab6?auto=format&fit=crop&w=800&q=80";
    } else if (lowerMessage.includes("سلطة")) {
        return "https://images.unsplash.com/photo-1572441710534-6801d3274f97?auto=format&fit=crop&w=800&q=80";
    } else if (lowerMessage.includes("مكرونة") || lowerMessage.includes("معكرونة")) {
        return "https://images.unsplash.com/photo-1604908177228-ecda5ffb5bb1?auto=format&fit=crop&w=800&q=80";
    } else {
        return null;
    }
}

function fetchRecipeFromGemini(userInput) {
    const API_KEY = "AIzaSyDM-oLNiv4OZkPgM5MyyQ3Zni_CYFVB1kk";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestData = {
        contents: [{ parts: [{ text: userInput }] }]
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.candidates && data.candidates.length > 0) {
            const recipeResponse = data.candidates[0].content.parts[0].text;
            addMessage("🍽️ إليك الوصفة اللذيذة اللي طلبتها! 👇\n\n" + recipeResponse, "bot-message");
            speakText(recipeResponse);

            const imageUrl = getImageForRecipe(userInput);
            if (imageUrl) {
                addImageMessage(imageUrl);
            }

        } else {
            addMessage("❌ أوف! ما لقيتش وصفة دلوقتي… جرب تكتبلي السؤال بشكل تاني يا شيف! 👨‍🍳", "bot-message");
        }
    })
    .catch(error => {
        addMessage("⚠️ حصل خطأ في جلب الوصفة… ارجع جرب كمان شوية 🙏", "bot-message");
    });
}
