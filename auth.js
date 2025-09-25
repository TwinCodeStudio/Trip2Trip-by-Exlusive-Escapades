// Simple front-end auth scaffolding (Firebase-ready)
function $(sel,root=document){return root.querySelector(sel)}

function showStatus(el, msg){ if(el){ el.textContent = msg; } }

// Email login
$('#loginForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  if(!email || !password){ return showStatus($('#loginStatus'),'Enter email and password.'); }
  // Placeholder success
  showStatus($('#loginStatus'),'Logging in...');
  setTimeout(()=>{
    localStorage.setItem('user', JSON.stringify({email, name: email.split('@')[0]}));
    location.href = 'index.html';
  }, 800);
});

// Email signup
$('#signupForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim();
  const password = $('#signupPassword').value;
  if(!name || !email || !password){ return showStatus($('#signupStatus'),'Fill all fields.'); }
  showStatus($('#signupStatus'),'Creating your account...');
  setTimeout(()=>{
    localStorage.setItem('user', JSON.stringify({email, name}));
    location.href = 'index.html';
  }, 900);
});

// Google auth (placeholder)
$('#loginWithGoogle')?.addEventListener('click', ()=>{
  alert('Google Sign-In placeholder. Connect Firebase or Google Identity Services.');
});
$('#signupWithGoogle')?.addEventListener('click', ()=>{
  alert('Google Sign-Up placeholder. Connect Firebase or Google Identity Services.');
});

/*
To enable real Google Sign-In quickly, add Firebase Web SDK:
1) Include scripts in each auth page before auth.js:
   <script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-auth-compat.js"></script>
2) Initialize:
   const app = firebase.initializeApp({ apiKey: '...', authDomain: '...', projectId: '...' });
   const auth = firebase.auth();
3) Google provider:
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider).then(()=> location.href='index.html');
*/

