const socket = io();

/**DOM elements */
const $msgForm = document.querySelector('.msg__form');
const $msgFormInput = document.querySelector('.input');
const $sendBtn = document.querySelector('.send__btn');
const $locBtn = document.querySelector('.location__btn');
const $msgContainer = document.querySelector('.msg__container');
const $sidebar = document.querySelector('.chat__sidebar');

// scraping data from url ex->http://localhost:3000/chat.html?username=la&room=ladav
const { username, room } = (() => {
    let queryString = location.search;                    // queryString = ?username=la&room=ladav
    queryString = queryString.replace('?username=', '');  // queryString = la&room=ladav
    queryString = queryString.replace('room=', '');       // queryString = la&ladav
    queryString = queryString.split('&');                 // ["la", "ladav"]

    return { username: queryString[0], room: queryString[1] };
})();

// auto scrolling message container
const autoScroll = () => {
    // fetch the last message
    const $lastMsg = $msgContainer.lastElementChild;

    // height of the last message
    const extraMargin = getComputedStyle($lastMsg).marginBottom;    // margin is proveided after each msg
    const lastMsgHeight = $lastMsg.offsetHeight + parseInt(extraMargin);

    // height of the visible container
    const visibleContainerHeight = $msgContainer.offsetHeight;

    // height of whole scrollable container
    const scrollContainerHeight = $msgContainer.scrollHeight;

    // how far i have scrolled from the top
    const scrollHeight = visibleContainerHeight + Math.ceil($msgContainer.scrollTop) + 2;
    if (scrollContainerHeight - lastMsgHeight <= scrollHeight) {
        $msgContainer.scrollTop = $msgContainer.scrollHeight;
        console.log('done');
    }
};

socket.on('message', (msg) => {
    const $msgTemplate = `
    <div class="msg__box">
        <div class="msg">
            <p>
                <span class="msg__name">${msg.username}</span>
                <span class="msg__time">${moment(msg.createdAt).format('h:mm A')}</span>
            </p>
            <p>${msg.text}</p>
        </div>
    </div>`;      
    $msgContainer.insertAdjacentHTML('beforeend', $msgTemplate);
    console.log(msg);

    autoScroll();
});

socket.on('locationMessage', (msg) => {
    const $locTemplate = `
    <div class="msg__box">
        <div class="msg">
            <p>
                <span class="msg__name">${msg.username}</span>
                <span class="msg__time">${moment(msg.createdAt).format('h:mm A')}</span>
            </p>
            <p>
                <a href=${msg.url} target="_blank">my current location</a>
            </p>
        </div>
    </div>`;

    $msgContainer.insertAdjacentHTML('beforeend', $locTemplate);
    console.log(msg);

    autoScroll();
});

socket.on('roomData', ({ room, users }) => {
    // cleaning the previous output
    $sidebar.textContent = ''

    let usersHTML = '';
    users.forEach((user) => {
        usersHTML = usersHTML + `<li>${user.username}</li>`;
    });

    const $sideBarTemplate = `
    <div class="sidebar__container">
        <h1>${room}</h1>
        <div class="active-users">
            <h2>Active</h2>
            <ul class="temp">
                ${usersHTML}
            </ul>
        </div>
    </div>`;

    $sidebar.insertAdjacentHTML('afterbegin', $sideBarTemplate);
});

$sendBtn.addEventListener('click', (event) => {
    event.preventDefault();

    $sendBtn.setAttribute('disabled', 'disabled');
    const msgText = $msgForm.elements.message.value;
    
    socket.emit('sendMessage', msgText, () => {
        $sendBtn.removeAttribute('disabled');
        $msgFormInput.value = '';
        $msgFormInput.focus();

        console.log('msg Delivered!');
    });
});

// sharing location
$locBtn.addEventListener('click', () => {
    event.preventDefault();

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser!');
    }

    $locBtn.setAttribute('disabled', 'disabled');

    setTimeout(() => {      // in case it take too long!
        if ($locBtn.getAttribute('disabled') === 'disabled') {
            alert(' can\'t fetch Geolocation!');
            $locBtn.removeAttribute('disabled');
            return; 
        }
    }, 5000);

    navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        };

        socket.emit('sendLocation', coords , () => {
            $locBtn.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});

window.onbeforeunload = function(){
    return 'Are you sure you want to leave?';
};