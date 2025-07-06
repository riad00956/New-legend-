// (script.js - No changes needed from the previous version)

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    const sections = document.querySelectorAll('.section');
    const joinForm = document.getElementById('join-form');
    const memberList = document.getElementById('member-list');
    const memberProfilePreview = document.getElementById('member-profile-preview');

    // --- 1. Fullscreen Intro Animation Page ---
    setTimeout(() => {
        introScreen.classList.add('fade-out');
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Show homepage section after intro
            showSection('home');
        }, 1000); // Wait for fade-out transition to finish
    }, 3000); // Auto ends after 3 seconds

    // --- 2. Menu Button (Hamburger - ☰) & Sidebar Toggle ---
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside (on main content)
    mainContent.addEventListener('click', (event) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });

    // --- 3. Section Navigation ---
    function showSection(id) {
        sections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            // Small delay to allow display:block to apply before transition
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 50);

            // Scroll to the section if it's not the homepage (which is initially top)
            if (id !== 'home') {
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor link behavior
            const targetId = link.getAttribute('href').substring(1); // Get section ID
            showSection(targetId);
            sidebar.classList.remove('open'); // Close sidebar after clicking a link
        });
    });

    // Handle initial hash in URL (for direct section access or refresh)
    if (window.location.hash) {
        const initialHash = window.location.hash.substring(1);
        if (!initialHash || initialHash === 'home') { // If hash is empty or #home
             showSection('home');
        } else {
             // Delay showing content if there's an initial hash, waits for intro to finish
             setTimeout(() => showSection(initialHash), 4000); // Adjust delay if intro animation changes
        }
    } else {
        // If no hash, default to homepage (after intro)
        // This is handled by the intro screen timeout
    }

    // --- 4. Members Page Functionality ---
    const members = []; // Array to store member data

    function renderMemberList() {
        memberList.innerHTML = '<p class="initial-prompt">Click a member name to view profile.</p>'; // Reset
        members.forEach((member, index) => {
            const memberNameDiv = document.createElement('div');
            memberNameDiv.classList.add('member-name');
            memberNameDiv.dataset.index = index; // Store index for easy lookup
            memberNameDiv.textContent = member.name;
            memberList.appendChild(memberNameDiv);
        });
        // Clear profile preview if no members are selected
        if (members.length === 0) {
            memberProfilePreview.innerHTML = `<h3>No Members Yet</h3><p>Be the first to join!</p>`;
        } else {
            // Show initial prompt or first member's profile
            memberProfilePreview.innerHTML = `<h3>Select a Member</h3><p>Profiles will appear here.</p>`;
        }
    }

    function showMemberProfile(member) {
        memberProfilePreview.innerHTML = `
            <img src="${member.imageUrl}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p><strong>Age:</strong> ${member.age}</p>
            <p><strong>Bio:</strong> ${member.bio}</p>
            ${member.facebookId ? `<a href="${member.facebookId}" target="_blank" class="social-link"><i class="fab fa-facebook"></i> Facebook Profile</a>` : ''}
        `;
    }

    memberList.addEventListener('click', (e) => {
        const clickedMemberName = e.target.closest('.member-name');
        if (clickedMemberName) {
            // Remove 'active' class from all member names
            document.querySelectorAll('.member-name').forEach(nameDiv => {
                nameDiv.classList.remove('active');
            });
            // Add 'active' class to the clicked member name
            clickedMemberName.classList.add('active');

            const index = clickedMemberName.dataset.index;
            if (members[index]) {
                showMemberProfile(members[index]);
            }
        }
    });

    // --- 5. Join System Functionality ---
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('memberName').value;
        const age = document.getElementById('memberAge').value;
        const bio = document.getElementById('memberBio').value;
        const imageUrl = document.getElementById('memberImageUrl').value;
        const facebookId = document.getElementById('memberFacebookId').value; // Get Facebook ID

        // Validate Image URL: only Google Photos link (photos.app.goo.gl)
        const googlePhotosRegex = /^https:\/\/photos\.app\.goo\.gl\/[a-zA-Z0-9]+$/;
        if (!googlePhotosRegex.test(imageUrl)) {
            alert('Please enter a valid Google Photos link (e.g., https://photos.app.goo.gl/...).');
            return;
        }

        // Validate Facebook ID Link: only facebook.com profile link
        const facebookProfileRegex = /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9._-]+(\/)?$/;
        if (!facebookProfileRegex.test(facebookId)) {
            alert('Please enter a valid Facebook profile link (e.g., https://www.facebook.com/your.profile.name).');
            return;
        }

        const newMember = {
            name,
            age,
            bio,
            imageUrl,
            facebookId // Include Facebook ID
        };

        members.push(newMember);
        renderMemberList(); // Re-render the member list

        // Clear form fields
        joinForm.reset();

        // Optionally, show the newly added member's profile immediately
        showMemberProfile(newMember);
        // And highlight the new member in the list
        const newMemberDiv = memberList.querySelector(`[data-index="${members.length - 1}"]`);
        if (newMemberDiv) {
            document.querySelectorAll('.member-name').forEach(nameDiv => {
                nameDiv.classList.remove('active');
            });
            newMemberDiv.classList.add('active');
        }

        // Navigate to members page to see the update
        showSection('members');
    });

    // Initial render of member list (will be empty unless predefined members are added)
    renderMemberList();

    // --- Initial Section Display ---
    // This part is handled by the intro screen
    // If you remove the intro, you can simply call showSection('home'); here.

});

