import fs from 'fs';

export function checkUserRepo(User){
    try {
        const data = fs.readFileSync('User.json', 'utf8');
        const users = JSON.parse(data);

        const userExists = users.Users.some(user => 
            user.login === User.login && user.password == User.password
        );

        return userExists;
    } catch (err) {
        console.error("Ошибка:", err);
        return false; // Возвращаем false в случае ошибки
    }
}