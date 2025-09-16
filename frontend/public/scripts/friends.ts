(async function() {

    // Only show friends list if on the friends page
    const friendSection = document.getElementById('friend-search-section');
    if (!friendSection) return;

    const oldContainer = document.getElementById('friendListContainer');
    if (oldContainer) {
        oldContainer.remove();
    }

    const friendListContainer = document.createElement('div');
    friendListContainer.id = "friendListContainer";
    friendListContainer.className = "mt-8 text-center";

    const friendListTitle = document.createElement('h2');
    friendListTitle.textContent = "Your friends";
    friendListTitle.className = "text-lg font-semibold mb-2 text-gray-800";
    friendListContainer.appendChild(friendListTitle);

    const friendList = document.createElement('ul');
    friendList.className = "space-y-1 text-white";
    friendListContainer.appendChild(friendList);

    friendSection.parentNode!.insertBefore(friendListContainer, friendSection.nextSibling);

    const friendSearchInput = document.getElementById('friendSearchInput') as HTMLInputElement;
    const friendSearchButton = document.getElementById('friendSearchButton') as HTMLButtonElement;

    // Ajout d'un élément pour afficher les messages
    const messageDiv = document.createElement('div');
    messageDiv.id = 'friendMessage';
    messageDiv.className = 'mt-2 text-center text-sm font-semibold';
    friendSection.parentNode!.insertBefore(messageDiv, friendSection);

    friendSearchButton.addEventListener('click', async () => {
        let query = friendSearchInput.value.trim();

        query = escapeHTML(query);

        if (!/^[\w]+$/.test(query)) {
            messageDiv.textContent = "Invalid username. Only letters, numbers, and underscores are allowed.";
            messageDiv.className = 'mt-2 text-center text-red-600 text-sm font-semibold';
            return;
        }
        if (!query) return;

        // Remove previous search results if any
        let friendSearchResults = document.getElementById('friendSearchResults') as HTMLUListElement;
        if (friendSearchResults) {
            friendSearchResults.remove();
        }

        // Create the search results container only for search
        friendSearchResults = document.createElement('ul');
        friendSearchResults.id = 'friendSearchResults';
        friendSearchResults.className = "w-full text-sm text-black bg-white  p-2 shadow border max-h-48 overflow-y-auto";
        friendSection.appendChild(friendSearchResults);

        const res = await fetch(`/authentification/friends/search/${encodeURIComponent(query)}`);
        const data = await res.json();

        friendSearchResults.innerHTML = '';
        if (data.succes && data.users.length > 0) {
            data.users.forEach((user: { username: string }) => {
                const li = document.createElement('li');
                li.className = "flex items-center justify-between gap-2 py-1"; // Flex row

                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = escapeHTML(user.username);
                usernameSpan.className = "text-black"; // Username styling

                const addButton = document.createElement('button');
                addButton.textContent = '+ Add';
                addButton.className = "px-3 py-1 bg-[#30b6df] text-white font-bold rounded shadow hover:bg-[#3cc0e8]"; // Box styling
                addButton.addEventListener('click', async () => {
                    const res = await fetch('/account/friends/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: username,
                            friendusername: user.username
                        })
                    });
                    const addData = await res.json();
                    if (addData.succes) {
                        messageDiv.textContent = `${user.username} added as a friend!`;
                        messageDiv.className = 'mt-2 text-center text-green-600 text-sm font-semibold';
                        // Rafraîchir la liste des amis
                        fetchAndDisplayFriends(username);
                    } else {
                        messageDiv.textContent = addData.message;
                        messageDiv.className = 'mt-2 text-center text-red-600 text-sm font-semibold';
                    }
                });

                li.appendChild(usernameSpan);
                li.appendChild(addButton);
                friendSearchResults.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Aucun utilisateur trouvé.';
            friendSearchResults.appendChild(li);
        }
    });


    async function fetchAndDisplayFriends(username: string) {
        try {
            const response = await fetch(`/account/friends/get?username=${encodeURIComponent(username)}`);
            const data = await response.json();

            friendList.innerHTML = '';

            if(data.success && data.friends.length > 0) {
                data.friends.forEach((friend: string) => {
                    const li = document.createElement('li');
                    li.className = "bg-[#4b6175] px-4 py-2  shadow flex justify-between items-center";

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = escapeHTML(friend);

                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Delete';
                    removeBtn.className = "ml-4 px-2 py-1 bg-red-500 text-white rounded-xs hover:bg-red-600 text-xs";
                    removeBtn.addEventListener('click', async () => {
                        const res = await fetch('/account/friends/remove', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, friendusername: friend })
                        });
                        const result = await res.json();
                        if (result.succes) {
                            messageDiv.textContent = `Friend "${friend}" deleted.`;
                            messageDiv.className = 'mt-2 text-center text-green-600 text-sm font-semibold';
                            fetchAndDisplayFriends(username);
                        } else {
                            messageDiv.textContent = result.message || "Erreur lors de la suppression.";
                            messageDiv.className = 'mt-2 text-center text-red-600 text-sm font-semibold';
                        }
                    });

                    li.appendChild(nameSpan);
                    li.appendChild(removeBtn);
                    friendList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = "No friend found";
                li.className = "text-gray-600";
                friendList.appendChild(li);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des amis:", error);
        }
    }

    const username = localStorage.getItem('username') || "defaultUsername"; 
    fetchAndDisplayFriends(username);

    function escapeHTML(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();