exports.ChatCode = () =>{
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const usernameLength = 10; // Random length between 5 and 20 characters
    let chatcode = '';

    for (let i = 0; i < usernameLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        chatcode += characters[randomIndex];
    }

    return chatcode;
}

