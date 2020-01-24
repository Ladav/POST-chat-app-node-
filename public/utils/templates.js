const createMsgTemplate = (msg) => {
    return `
    <div class=${msg.userMsg ? 'msg__box__user' : 'msg__box'}>
        <div class=${msg.userMsg ? 'msg__user' : 'msg'}>
            <p class="msg__header">
                <span class="msg__name">${msg.username}</span>
                <span class="msg__time">${moment(msg.createdAt).format('h:mm A')}</span>
            </p>
            <p class="msg__text">${msg.text}</p>
        </div>
    </div>`;
};

const createLocTemplate = (msg) => {
    return `
    <div class="msg__box">
        <div class="msg">
            <p>
                <span class="msg__name">${msg.username}</span>
                <span class="msg__time">${moment(msg.createdAt).format('h:mm A')}</span>
            </p>
            <p>
                <a href=${msg.url} target="_blank" class="msg__location"><i class="ion-ios-location"></i></a>
            </p>
        </div>
    </div>`;
};

const createUsersTemplate = (users) => {
    let usersHTML = '';
    users.forEach((user) => {
        usersHTML = usersHTML + `<li class="user">
                                    <div class="user__avatar">${user.username.charAt(0)}</div>
                                    <div class="user__name">${user.username}</div>
                                    <div class="user__online">
                                        <div class="user__online--icon"></div>
                                        <div class="user__online--time">${moment(user.createdAt).format('h:mm A')}</div>
                                    </div>
                                </li>`; });
                                
    return usersHTML;
};

const createSidebarTemplate = (room, users ) => {
    const usersActive = createUsersTemplate(users);

    return `
    <div class="sidebar__container">
        <div class="room">
            <div class="room__name">${room}</div>
        </div>
        <div class="active__users">
            <ul>
                ${usersActive}
            </ul>
        </div>
    </div>`;
};