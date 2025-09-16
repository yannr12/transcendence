const usernameIndex = localStorage.getItem('username');
const token = localStorage.getItem('token');

let scriptIndex = 0;


document.addEventListener("DOMContentLoaded", () => {
	const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
	const page = currentPath === '' ? 'index' : currentPath;
	
	if (page === "pvp" || page === "pong_4P" || page === "pong_1vbot" || page === "survival_mode" || page === "tournoi")
		return call_page(localStorage.getItem("token") ? "registered_user" : "modes");

	switch (page)
	{
		case "pvp":
			if (localStorage.getItem("gameMode") !== "1v1")
				return localStorage.getItem("token") ? goBack("registered_user") : goBack("modes");
			if (localStorage.getItem("token"))
				return goBack("registered_user");
			break;
		case "pong_4P":
			if (localStorage.getItem("gameMode") !== "1v1v1v1")
				return localStorage.getItem("token") ? goBack("registered_user") : goBack("modes");
			if (localStorage.getItem("token"))
				return goBack("registered_user");
			break;
		case "pong_1vbot":
			if (localStorage.getItem("gameMode") !== "1v1")
				return goBack("registered_user"); goBack("registered_user");
			if (!localStorage.getItem("token"))
				return goBack("modes");
			break;
		case "survival_mode":
			if (localStorage.getItem("gameMode") !== "survival")
				return goBack("registered_user");
			if (!localStorage.getItem("token"))
				return goBack("modes");
			break;
		case "modes":
			if (localStorage.getItem("token"))
				return goBack("registered_user");
			break;
		case "registered_user":
			if (!localStorage.getItem("token"))
				return goBack("modes");
			break;
		default:
			break;
	}

	if (usernameIndex && token) {
		if (page === 'index') {
			call_page('registered_user');
			return;
		}
		call_page(page, false);
		return;
	}

	if (page !== 'index')
		call_page(page, false);
})


async function call_page(page: string, pushState: boolean = true)
{
	let html = '';
	removeScripts();
	scriptIndex = 0;
    const index = document.getElementById("injection") as HTMLElement;
    if (page == "login")
    {
        html = `<div class="h-screen w-screen flex bg-cover bg-center bg-no-repeat bg-fixed" style="background-image: url('/assets/background_flipped.png');">

       <div class="absolute bottom-0 left-0 w-0 h-0 z-30 border-b-[200px] border-b-white border-r-[200px] border-r-transparent"></div>
        <div class="absolute top-0 left-0 w-0 h-0 z-30 border-t-[200px] border-t-white border-r-[200px] border-r-transparent"></div>
        <div class="absolute top-0 w-0 h-0 z-30 border-r-[200px] border-r-white border-b-[200px] border-b-transparent" style="left: calc(50% - 200px);"></div>
        <div class="absolute bottom-0 w-0 h-0 z-30 border-r-[200px] border-r-white border-t-[200px] border-t-transparent" style="left: calc(50% - 200px);"></div>
        
        <div class="relative z-10 border-l-[50px] border-t-[50px] border-b-[50px] border-white h-screen w-[calc(50%-50px)]"></div>
        
        <div class="bg-white relative z-10 h-screen overflow-y-auto w-[calc(50%+50px)]">
          <form
            id="login-form"
            class="w-full min-h-full flex flex-col justify-center px-16 gap-4 font-mono"
          >
            <h2 class="text-3xl font-bold text-center text-black mb-8">
              LOGIN
            </h2>
            
            <label class="text-black text-base mb-2">E-mail address</label>
            <input
              type="email"
              name="username"
              placeholder=""
              required
              class="w-full p-3 mb-4 border border-black text-black bg-white text-base font-mono"
            />
            
            <label class="text-black text-base mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder=""
              required
              class="w-full p-3 mb-4 border border-black text-black bg-white text-base font-mono"
            />

            <div id="login-error-message" class="text-red-600 text-sm mb-4"></div>
            
            
            <div class="text-black text-base mb-2">
            <a onclick="call_page('register')" class="text-black underline">
                I sign up for the expedition
              </a>
            </div>
            <button
              type="submit"
              class="w-full py-4 bg-[#30b6df] text-white text-sm border-none cursor-pointer font-mono"
            >
              GO NOW
            </button>
            
            <div class="border-t-2 border-dashed border-black my-10"></div>
            
            <div class="text-black text-sm mb-5">
              <a onclick="call_page('guest')" class="text-black underline">
                I board without registering
              </a>
            </div>
            
            
            <div class="flex justify-between items-center">
              <div>
                <div class="flex gap-[2px] p-4">
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[6px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[4px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[6px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[4px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[6px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[4px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[6px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                  <div class="w-[2px] h-14 bg-black"></div>
                </div>
                <div class="text-black text-m mb- tracking-[2px]" style="font-family: 'Victor Mono', monospace;">
                  3 1 4 1 5 9 2 6 5 
                </div>
              </div>
              <div class="text-xl">🌍 ➔ 🪐</div>
            </div>
            
            <div class="text-center mt-4">
              <a onclick="call_page('index')" class="text-black underline text-sm">
                Return to home
              </a>
            </div>
          </form>
        </div>
      </div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/login.js"]);
      if (pushState) window.history.pushState({ page: 'login' }, '', '/login');
    }
    else if (page == "register")
    {
      html = `<div class="h-screen w-screen flex bg-cover bg-center bg-no-repeat bg-fixed" style="background-image: url('assets/background_flipped.png');">
      <style>
        .triangle {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0;
          border-bottom: 200px solid rgb(255, 255, 255);
          border-left: 200px solid transparent;
          z-index: 30;
        }
        .triangle-top {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-top: 200px solid rgb(255, 255, 255);
          border-left: 200px solid transparent;
          z-index: 30;
        }
        .triangle-mirror {
          position: absolute;
          top: 0;
          right: calc(50% - 200px);
          width: 0;
          height: 0;
          border-left: 200px solid rgb(255, 255, 255);
          border-bottom: 200px solid transparent;
          z-index: 30;
        }
        .triangle-bottom {
          position: absolute;
          bottom: 0;
          right: calc(50% - 200px);
          width: 0;
          height: 0;
          border-left: 200px solid rgb(255, 255, 255);
          border-top: 200px solid transparent;
          z-index: 30;
        }
      </style>

      <!-- Triangle decorations (mirrored to the right) -->
      <div class="triangle"></div>
      <div class="triangle-top"></div>
      <div class="triangle-mirror"></div>
      <div class="triangle-bottom"></div>

      <!-- Left half - register form -->
      <div class="bg-white relative z-10 h-screen overflow-y-auto" style="width: calc(50% + 50px);">
        <form
          id="register-form"
          class="w-full min-h-full flex flex-col justify-center px-16 gap-4"
          style="font-family: 'Courier New', monospace;"
        >
          <div id="register-error" style="display:none; color:red; font-size:1rem; text-align:center; margin-bottom:1rem;"></div>
          <h2 class="text-3xl font-bold text-center text-black mb-8">
            Register
          </h2>
          <label class="text-black text-base mb-2">Username</label>
          <input
            type="text"
            name="username"
            placeholder=""
            required
            class="w-full p-3 mb-4 border border-black text-black bg-white text-base"
            style="font-family: 'Courier New', monospace;"
          />
          <label class="text-black text-base mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder=""
            required
            class="w-full p-3 mb-4 border border-black text-black bg-white text-base"
            style="font-family: 'Courier New', monospace;"
          />
          <label class="text-black text-base mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder=""
            required
            class="w-full p-3 mb-4 border border-black text-black bg-white text-base"
            style="font-family: 'Courier New', monospace;"
          />
          <label class="text-black text-base mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            placeholder=""
            required
            class="w-full p-3 mb-4 border border-black text-black bg-white text-base"
            style="font-family: 'Courier New', monospace;"
          />
          <button
            type="submit"
            class="w-full py-4 bg-[#30b6df] text-white text-sm border-none cursor-pointer"
            style="font-family: 'Courier New', monospace;"
          >
            CONFIRM
          </button>
          <div class="text-black text-base mt-4">
            <a onclick="call_page('login')" class="text-black underline">
              Already have an account? Login
            </a>
          </div>
          <div class="text-center mt-4">
            <a onclick="call_page('index')" class="text-black underline text-sm">
              Back to Home
            </a>
          </div>
        </form>
      </div>

      <!-- Right half - background image with white borders -->
      <div class="relative z-10 border-r-[50px] border-t-[50px] border-b-[50px] border-white h-screen" style="width: calc(50% - 50px);"></div>
    </div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/register.js"]);
      if (pushState)
        window.history.pushState({ page: 'register' }, '', '/register');
    }
    else if (page == "guest")
    {
      html = `<div class="w-full max-w-md mx-auto p-8 flex flex-col items-center font-mono space-y-6">

  <!-- Button Group -->
  <div class="flex flex-col gap-4 w-full">
    <button onclick="call_page('modes')" 
      class="relative bg-white text-black text-left font-bold py-5 pl-6 pr-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 " 
      style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)">
      PLAY PONG
    </button>

    <button onclick="call_page('tournoi')" 
      class="relative bg-white text-black text-left font-bold py-5 pl-6 pr-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 " 
      style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)">
      LOCAL TOURNAMENT
    </button>
  </div>

  <!-- Back Button -->
  <div class="w-full flex justify-center">
    <button onclick="call_page('index')" 
      class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none">
      <svg width="80" height="48" viewBox="0 0 80 48" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 10L4 24L24 38V30H76V18H24V10Z" />
      </svg>
    </button>
  </div>

  <!-- Guest Notice -->
  <div class="w-full text-center bg-white/80 text-[#666] text-sm p-4 rounded">
    <p>You're browsing as a guest. Some features may be limited.</p>
    <div class="mt-2 flex gap-2 justify-center">
      <a onclick="call_page('login')" class="text-[#3CAFDA] hover:underline cursor-pointer">Login</a>
      <span>or</span>
      <a onclick="call_page('register')" class="text-[#3CAFDA] hover:underline cursor-pointer">Register</a>
    </div>
  </div>

</div>
`;
      index.innerHTML = html;
      loadScripts(["/scripts/guest.js"]);
      if (pushState) window.history.pushState({ page: 'guest' }, '', '/guest');
    }
    else if (page == "registered_user")
    {
      html = `
		<div class="h-screen w-screen flex bg-cover bg-center bg-no-repeat bg-fixed relative justify-center items-center" style="background-image: url('../assets/background_flipped.png');">
      <!-- Board -->
      <div id="board" class="hidden md:flex shadow-[0px_5px_#472c24,0px_-5px_#472c24,5px_0px_#472c24,-5px_0px_#472c24,0px_8px_rgba(0,0,0,0.22),5px_5px_rgba(0,0,0,0.22),-5px_5px_rgba(0,0,0,0.22),inset_0px_3px_rgba(255,255,255,0.21)] z-10 backdrop-blur-sm border-2 border-[#f4d474] relative bg-no-repeat bg-cover bg-fixed w-[400px] h-[250px] flex justify-between items-center bg-[#314e7034]" >
		<div id="countdown" class="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[250px] text-[#ffbd42] z-30 absolute"></div>
		<div id="paddle1" class="w-[9px] h-[50px] border-[#f4d474] bg-[#32bdca] absolute left-0"></div>
		<div id="paddle2" class="w-[9px] h-[50px] bg-[#2293af] absolute right-0"></div>
		<div id="ball" class="w-[15px] h-[15px] bg-[#f4d474] absolute left-0 top-0 z-40"></div>
		<div id="bonus" class="w-[60px] h-[60px] rounded-md absolute z-40"></div>
		<div id="left-score" class="absolute text-[#bbe4deff] opacity-80 left-[25%] text-[2px] -translate-x-1/2 z-30"></div>
		<div id="right-score" class="absolute text-[#472c24] opacity-80 right-[25%] text-[2px] translate-x-1/2 z-30"></div>
	</div>
      <div class="absolute top-8 left-0 right-0 px-4 z-20 flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-4">
        <!-- Profile Card -->
        <div class="bg-white px-6 py-4 sm:p-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-mono w-full sm:max-w-[600px]">
          <!-- Avatar -->
          <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center overflow-hidden relative">
            <!-- corner decorations -->
            <div class="absolute top-0 left-0 w-0 h-0 z-10 border-t-[12px] border-t-white border-r-[12px] border-r-transparent"></div>
            <div class="absolute top-0 right-0 w-0 h-0 z-10 border-t-[12px] border-t-white border-l-[12px] border-l-transparent"></div>
            <div class="absolute bottom-0 left-0 w-0 h-0 z-10 border-b-[12px] border-b-white border-r-[12px] border-r-transparent"></div>
            <div class="absolute bottom-0 right-0 w-0 h-0 z-10 border-b-[12px] border-b-white border-l-[12px] border-l-transparent"></div>
            <img id="user-avatar" src="" alt="Avatar" class="w-full h-full object-cover hidden">
            <span id="user-initial" class="text-2xl sm:text-3xl font-bold text-black relative z-20">U</span>
          </div>
          <!-- Username Info -->
          <div class="text-center sm:text-left break-words">
            <div id="username-display" class="text-black font-bold text-xl sm:text-2xl">Username</div>
            <div class="flex items-center justify-center sm:justify-start gap-2 text-gray-600 text-base sm:text-lg">
				<div class="flex gap-1">
					<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-green"></div>
					<!-- <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-green" style="animation-delay: 0.3s;"></div>
					<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-green" style="animation-delay: 0.6s;"></div> -->
				</div>
				<span>Online</span>
            </div>
          </div>
        </div>
        <!-- Right buttons -->
        <div class="flex gap-4 self-end sm:self-auto">
          <button onclick="goBack('stats')" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none">
            <svg width="48" height="43" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.75 5.10123V5.14686C13.75 5.68436 13.75 5.95373 13.6206 6.17373C13.4912 6.39373 13.2556 6.52436 12.7856 6.78623L12.29 7.06123C12.6312 5.90623 12.7456 4.66498 12.7875 3.60373L12.7937 3.46561L12.795 3.43311C13.2019 3.57436 13.4306 3.67998 13.5731 3.87748C13.75 4.12311 13.75 4.44936 13.75 5.10123ZM1.25 5.10123V5.14686C1.25 5.68436 1.25 5.95373 1.37938 6.17373C1.50875 6.39373 1.74437 6.52436 2.21438 6.78623L2.71062 7.06123C2.36875 5.90623 2.25437 4.66498 2.2125 3.60373L2.20625 3.46561L2.20563 3.43311C1.79813 3.57436 1.56938 3.67998 1.42687 3.87748C1.25 4.12311 1.25 4.44998 1.25 5.10123Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2356 1.46689C9.33134 1.31877 8.4163 1.24622 7.49999 1.25002C6.38561 1.25002 5.46686 1.34814 4.76436 1.46689C4.05249 1.58689 3.69686 1.64689 3.39936 2.01314C3.10249 2.37939 3.11811 2.77502 3.14936 3.56627C3.25749 6.28377 3.84374 9.67877 7.03124 9.97877V12.1875H6.13749C5.99306 12.1876 5.85311 12.2377 5.74145 12.3293C5.62979 12.4209 5.5533 12.5484 5.52499 12.69L5.40624 13.2813H3.74999C3.62567 13.2813 3.50644 13.3307 3.41853 13.4186C3.33062 13.5065 3.28124 13.6257 3.28124 13.75C3.28124 13.8743 3.33062 13.9936 3.41853 14.0815C3.50644 14.1694 3.62567 14.2188 3.74999 14.2188H11.25C11.3743 14.2188 11.4935 14.1694 11.5814 14.0815C11.6694 13.9936 11.7187 13.8743 11.7187 13.75C11.7187 13.6257 11.6694 13.5065 11.5814 13.4186C11.4935 13.3307 11.3743 13.2813 11.25 13.2813H9.59374L9.47499 12.69C9.44668 12.5484 9.37019 12.4209 9.25853 12.3293C9.14687 12.2377 9.00692 12.1876 8.86249 12.1875H7.96874V9.97877C11.1562 9.67877 11.7431 6.28439 11.8506 3.56627C11.8819 2.77502 11.8981 2.37877 11.6006 2.01314C11.3031 1.64689 10.9475 1.58689 10.2356 1.46689Z" fill="white"/>
              </svg>
          </button>
		  <button onclick="goBack('friends')" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none">
			<svg width="55" height="40" viewBox="0 0 55 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M16.5 20C21.8195 20 26.125 15.6945 26.125 10.375C26.125 5.05547 21.8195 0.75 16.5 0.75C11.1805 0.75 6.875 5.05547 6.875 10.375C6.875 15.6945 11.1805 20 16.5 20ZM23.1 22.75H22.3867C20.5992 23.6094 18.6141 24.125 16.5 24.125C14.3859 24.125 12.4094 23.6094 10.6133 22.75H9.9C4.43437 22.75 0 27.1844 0 32.65V35.125C0 37.4023 1.84766 39.25 4.125 39.25H28.875C31.1523 39.25 33 37.4023 33 35.125V32.65C33 27.1844 28.5656 22.75 23.1 22.75ZM41.25 20C45.8047 20 49.5 16.3047 49.5 11.75C49.5 7.19531 45.8047 3.5 41.25 3.5C36.6953 3.5 33 7.19531 33 11.75C33 16.3047 36.6953 20 41.25 20ZM45.375 22.75H45.0484C43.8539 23.1625 42.5906 23.4375 41.25 23.4375C39.9094 23.4375 38.6461 23.1625 37.4516 22.75H37.125C35.3719 22.75 33.7562 23.257 32.3383 24.0734C34.4352 26.3336 35.75 29.3328 35.75 32.65V35.95C35.75 36.1391 35.707 36.3195 35.6984 36.5H50.875C53.1523 36.5 55 34.6523 55 32.375C55 27.0555 50.6945 22.75 45.375 22.75Z" fill="white"/>
				</svg>
		  </button>
          
          <button onclick="goBack('profile')" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none">
            <svg width="48" height="45" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.9999 33.4584C21.7566 33.4584 19.6052 32.5672 18.0189 30.981C16.4327 29.3947 15.5415 27.2433 15.5415 25C15.5415 22.7568 16.4327 20.6053 18.0189 19.0191C19.6052 17.4329 21.7566 16.5417 23.9999 16.5417C26.2431 16.5417 28.3946 17.4329 29.9808 19.0191C31.567 20.6053 32.4582 22.7568 32.4582 25C32.4582 27.2433 31.567 29.3947 29.9808 30.981C28.3946 32.5672 26.2431 33.4584 23.9999 33.4584ZM41.9557 27.3442C42.0524 26.5709 42.1249 25.7975 42.1249 25C42.1249 24.2025 42.0524 23.405 41.9557 22.5834L47.0549 18.6442C47.514 18.2817 47.6349 17.6292 47.3449 17.0975L42.5115 8.73588C42.2215 8.20421 41.569 7.98671 41.0374 8.20421L35.0199 10.6209C33.7632 9.67838 32.4582 8.85671 30.9357 8.25255L30.0415 1.84838C29.9924 1.56374 29.8442 1.30566 29.623 1.11988C29.4018 0.934095 29.122 0.832601 28.8332 0.833378H19.1665C18.5624 0.833378 18.0549 1.26838 17.9582 1.84838L17.064 8.25255C15.5415 8.85671 14.2365 9.67838 12.9799 10.6209L6.96236 8.20421C6.43069 7.98671 5.77819 8.20421 5.48819 8.73588L0.654856 17.0975C0.340689 17.6292 0.48569 18.2817 0.944856 18.6442L6.04402 22.5834C5.94736 23.405 5.87486 24.2025 5.87486 25C5.87486 25.7975 5.94736 26.5709 6.04402 27.3442L0.944856 31.3559C0.48569 31.7184 0.340689 32.3709 0.654856 32.9025L5.48819 41.2642C5.77819 41.7959 6.43069 41.9892 6.96236 41.7959L12.9799 39.355C14.2365 40.3217 15.5415 41.1434 17.064 41.7475L17.9582 48.1517C18.0549 48.7317 18.5624 49.1667 19.1665 49.1667H28.8332C29.4374 49.1667 29.9449 48.7317 30.0415 48.1517L30.9357 41.7475C32.4582 41.1192 33.7632 40.3217 35.0199 39.355L41.0374 41.7959C41.569 41.9892 42.2215 41.7959 42.5115 41.2642L47.3449 32.9025C47.6349 32.3709 47.514 31.7184 47.0549 31.3559L41.9557 27.3442Z" fill="white"/>
				</svg>
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:pb-8 z-10">
  <div class="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-end gap-4 max-h-full overflow-y-auto">

    <!-- Buttons -->
    <div class="flex flex-col gap-4 w-full sm:w-1/2 max-w-md">
      <button id="1vbot" class="relative bg-white text-black text-left font-bold py-5 pl-6 pr-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 " style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)">PLAY AGAINST BOT</button>
      <button id="survival" class="relative bg-white text-black text-left font-bold py-5 pl-6 pr-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)">SURVIVAL MODE</button>
      <button onclick="goBack('tournoi')" class="relative bg-white text-black text-left font-bold py-5 pl-6 pr-12 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%)">TOURNAMENT</button>
      <a id="logout-btn" class="font-victor text-white bg-[#3CAFDA] px-3 py-1 m-2 text-sm border-0 shadow-[0px_2px_rgb(255,255,255),0px_-2px_rgb(255,255,255),2px_0px_rgb(255,255,255),-2px_0px_rgb(255,255,255),0px_4px_rgba(0,0,0,0.22),2px_2px_rgba(0,0,0,0.22),-2px_2px_rgba(0,0,0,0.22),inset_0px_2px_rgba(255,255,255,0.21)] cursor-pointer no-underline inline-block transition-transform duration-100 active:translate-y-0.5 w-fit">
              logout
            </a>
    </div>

    <!-- Classement général toggle button (only visible on small screens) -->
    <button id="toggle-ranking-btn"
      class="block lg:hidden bottom-4 right-4 z-50 px-4 py-2 bg-[#ffffff] text-[#00000070] shadow font-mono"
      onclick="toggleRanking()">
      show ranking
    </button>
    <!-- Classement général -->
    <div id="survival-records-container"
      class="hidden lg:block z-50 bg-white bg-opacity-90 shadow-lg p-6 w-full sm:w-[22rem] max-h-[30vh] overflow-y-auto font-mono">
      <h2 class="text-xl font-normal text-black mb-4" style="font-family: 'Victor Mono', monospace;"> > General Ranking</h2>
      <div class="space-y-2">
        <!-- List of players -->
        <div class="bg-gray-300 rounded-full px-4 py-1 text-gray-700 text-sm flex items-center" style="font-family: 'Victor Mono', monospace; font-weight: 300;">
            <span>Player 1</span>
          </div>
          <div class="bg-gray-300 rounded-full px-4 py-1 text-gray-700 text-sm flex items-center" style="font-family: 'Victor Mono', monospace; font-weight: 300;">
            <span>Player 2</span>
          </div>
      </div>
    </div>
      `;
      index.innerHTML = html;
      
      loadScripts(["/scripts/registered_user.js", "/scripts/pong/game.js"]);
      if (pushState) window.history.pushState({ page: 'registered_user' }, '', '/registered_user');
    }
    else if (page == "profile")
    {
      html = `
      <div class="h-screen w-screen flex bg-cover bg-center bg-no-repeat bg-fixed font-mono relative" style="background-image: url('/assets/background.png');">

  <!-- Triangles décoratifs -->
  <div class="hidden md:block absolute bottom-0 left-0 w-0 h-0 z-30 border-b-[200px] border-b-white border-r-[200px] border-r-transparent"></div>
  <div class="hidden md:block absolute top-0 left-0 w-0 h-0 z-30 border-t-[200px] border-t-white border-r-[200px] border-r-transparent"></div>
  <div class="hidden md:block absolute top-0 w-0 h-0 z-30 border-r-[200px] border-r-white border-b-[200px] border-b-transparent" style="left: calc(50% - 200px);"></div>
  <div class="hidden md:block absolute bottom-0 w-0 h-0 z-30 border-r-[200px] border-r-white border-t-[200px] border-t-transparent" style="left: calc(50% - 200px);"></div>

  <!-- Bande blanche gauche avec PROFIL -->
  <div class="relative z-10 border-l-[50px] border-t-[50px] border-b-[50px] border-white h-screen w-[calc(50%-50px)] hidden md:flex items-start justify-start pl-2 pt-20">
  </div>

  <!-- Formulaire profil -->
  <div class="bg-white relative z-10 h-screen overflow-y-auto w-full md:w-[calc(50%+50px)] flex justify-center items-center">
    <div class="w-full max-w-md p-8 flex flex-col items-center">


      <form class="w-full flex flex-col gap-4 font-mono">
        <!-- Avatar Upload -->
        <div class="flex flex-col items-center mb-4">
          <img id="avatarPreview" src="https://via.placeholder.com/150" class="w-32 h-32 rounded-full object-cover mb-2 border-2 border-black">
          <label for="avatarUpload" class="px-4 py-2 bg-gray-200 text-black rounded-lg cursor-pointer hover:bg-gray-300 transition">
            Upload Avatar
          </label>
          <input type="file" id="avatarUpload" name="avatar" accept="image/*" class="hidden">
        </div>
        <div id="file-too-large" class="text-red-600 text-sm mb-4"></div>

        <!-- Username -->
        <label class="flex flex-col text-black text-base">
          Username
          <input type="text" id="username" name="username" class="mt-1 p-3 border border-black text-black bg-white" placeholder="">
        </label>

        <!-- Age -->
        <label class="flex flex-col text-black text-base">
          Age
          <input type="number" id="age" name="age" class="mt-1 p-3 border border-black text-black bg-white" placeholder="">
        </label>

        <!-- Email -->
        <label class="flex flex-col text-black text-base">
          Email
          <input type="email" id="email" name="email" class="mt-1 p-3 border border-black text-black bg-white" placeholder="">
        </label>

        <!-- Change Password -->
        <label class="flex flex-col text-black text-base">
          Change Password
          <input type="password" id="password" name="password" class="mt-1 p-3 border border-black text-black bg-white" placeholder="New password">
        </label>

        <!-- Repeat Password -->
        <label class="flex flex-col text-black text-base">
          Repeat Password
          <input type="password" id="passwordRepeat" name="passwordRepeat" class="mt-1 p-3 border border-black text-black bg-white" placeholder="Repeat password">
        </label>

        <!-- Save Changes Button -->
        <button type="submit" class="mt-4 w-full py-4 bg-[#30b6df] text-white font-bold hover:bg-[#3cc0e8] transition">
          Save Changes
        </button>
      </form>

      <!-- Separator -->
      <div class="border-t-2 border-dashed border-black my-8 w-full"></div>

      <!-- Two-Factor Authentication -->
      <div class="text-center mb-4">
        <a onclick="call_page('2fa')" class="inline-block bg-[#328199] text-white py-3 px-6 hover:bg-[#6ba6b8] transition font-semibold shadow hover:shadow-md">
          Two-Factor Authentication
        </a>
      </div>

      <!-- Retour Dashboard -->
      <div class="text-center">
        <a onclick="call_page('registered_user')" class="text-black underline text-base">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  </div>
</div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/profile.js"]);
      if (pushState) window.history.pushState({ page: 'profile' }, '', '/profile');
    }
    else if (page == "2fa")
    {
      html = `<div class="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed font-mono relative">
    <!-- Error box placeholder -->
    <div id="errorBox" style="display:none;"></div>
    <!-- Loading spinner placeholder -->
    <div id="loadingSpinner" style="display:none;"></div>

    <div class="bg-white bg-opacity-80 backdrop-blur-sm shadow-lg p-8 w-full max-w-md flex flex-col items-center justify-center z-10">
      <h2 class="text-3xl font-bold text-center text-black mb-8">
        Two-Factor Authentication
      </h2>
      <div class="space-y-6 w-full">
        <div class="flex items-center justify-between w-full">
          <div>
            <h3 class="text-lg font-semibold text-gray-700">Email 2FA</h3>
            <p class="text-sm text-gray-500">Secure your account with email verification</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="email2faToggle" class="sr-only peer" onchange="toggleEmail2FA()">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#112550]"></div>
          </label>
        </div>
        <div id="emailSection" class="hidden space-y-4">
          <div>
            <label for="emailInput" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm your email address
            </label>
            <input 
              type="email" 
              id="emailInput" 
              placeholder="Enter your registered email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#112550] focus:border-transparent text-black bg-white placeholder-gray-500"
            >
          </div>
          <button 
            onclick="confirmEmail()" 
            class="w-full bg-[#30b6df] text-white py-2 px-4 rounded-md hover:bg-[#3cc0e8] transition duration-200 font-bold shadow"
          >
            Confirm Email
          </button>
          <div id="statusMessage" class="hidden p-3 rounded-md text-sm"></div>
        </div>
      </div>
      <div class="border-t-2 border-dashed border-black my-10 w-full"></div>
      <div class="text-center mt-2 w-full">
        <a onclick="call_page('profile')" class="text-black underline text-sm mb-4 font-semibold">
          Back to Profile
        </a>
      </div>
    </div>
  </div>
  <script>
    
  </script>
  `;
      index.innerHTML = html;
      loadScripts(["/scripts/2fa.js"], () => {
        if (typeof window.loadCurrentStatus === "function") window.loadCurrentStatus();
      });
      if (pushState) window.history.pushState({ page: '2fa' }, '', '/2fa');
    }
    else if (page == "tournoi")
    {
      html = `
      <div class="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed font-mono relative" style="background-image: url('/assets/background.png');">


    <div class="h-screen overflow-y-auto bg-white bg-opacity-80 backdrop-blur-sm p-10 rounded-xl shadow-lg max-w-lg w-[90%] flex flex-col items-center">

      <h1 class="text-3xl md:text-4xl font-bold text-black mb-6 text-center">TOURNAMENT</h1>

      <label for="playersCount" class="text-black text-lg mb-2 text-center">Number of additional players :</label>
      <input
        id="playersCount"
        type="number"
        min="0"
        max="15"
        value="0"
        class="w-full p-3 mb-4 border border-black text-black bg-white focus:outline-none focus:border-blue-500"
      />

      <div id="player-names-container" class="mt-4 space-y-2 w-full text-black bg-white border-black">
      </div>

      <button
        id="startTournamentBtn"
        class="w-full py-3 bg-[#30b6df] text-white font-bold hover:bg-[#3cc0e8] transition mb-4"
      >
        Start the tournament
      </button>

      <div id="tournament-status" class="mt-2 text-black text-center"></div>

      <button
        id="startMatchBtn"
        class="w-full py-3 bg-[#30b6df] text-white font-bold hover:bg-[#3cc0e8] transition mt-4 hidden"
      >
        Next Game
      </button>

      <div id="tournament-bracket" class="mt-6 w-full text-black border-black"></div>

      <div class="border-t-2 border-dashed border-black my-6 w-full"></div>

      <a id="leftTournament" class="text-black underline text-sm">
        Leave the tournament
      </a>
    </div>
  </div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/tournoi.js"]);
      if (pushState) window.history.pushState({ page: 'tournoi' }, '', '/tournoi');
    }
    else if (page == "friends")
    {
      html = `
        <div class="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed font-mono relative" style="background-image: url('/assets/background.png');">

  <!-- Error box placeholder -->
  <div id="errorBox" style="display:none;"></div>
  <!-- Loading spinner placeholder -->
  <div id="loadingSpinner" style="display:none;"></div>

  <!-- Bloc central amis -->
  <div class="bg-white bg-opacity-80 backdrop-blur-sm shadow-lg p-8 w-full max-w-md flex flex-col items-center justify-center z-10">

    <h2 class="text-3xl font-bold text-center text-black mb-8">
      MY FRIENDS
    </h2>

    <!-- Zone de recherche d'amis -->
    <div id="friend-search-section" class="flex flex-col items-center w-full gap-4">
      <div class="flex w-full gap-2">
        <input
          type="text"
          id="friendSearchInput"
          placeholder="Search a friend"
          class="flex-1 p-3  border border-black text-black bg-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-500 transition shadow"
        />
        <button
          id="friendSearchButton"
          class="px-4 py-2 bg-[#30b6df] text-white font-bold  hover:bg-[#3cc0e8] transition shadow">
          Search
        </button>
      </div>
    </div>

    <!-- Friends list will be injected here by JS, now scrollable -->
    <!-- Ligne séparatrice -->
    <div class="border-t-2 border-dashed border-black my-10 w-full"></div>

    <!-- Bouton retour -->
    <a onclick="call_page('registered_user')" class="text-black underline text-sm mb-4">
      Back to Dashboard
    </a>
  </div>
</div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/friends.js"]);
      if (pushState) window.history.pushState({ page: 'friends' }, '', '/friends');
    }
    else if (page == "stats")
    {
      html = `
        <div class="h-screen w-screen flex justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed font-mono" style="background-image: url('/assets/background.png');">
  
  <div class="bg-white bg-opacity-80 backdrop-blur-sm relative z-10 h-screen overflow-y-auto w-full max-w-xl flex flex-col items-center px-8 py-6">
    <header class="w-full text-black py-4 shadow-md text-center">
      <h1 class="text-3xl font-bold">STATISTICS</h1>
    </header>
    <main class="w-full max-w-xl flex flex-col gap-6 mt-6">
      <div id="stats-container" class="p-6 bg-white bg-opacity-80 backdrop-blur-sm text-black rounded-xl shadow text-center">
        <p>Loading statistics...</p>
      </div>
      <div id="stats-container2" class="p-6 bg-white bg-opacity-80 backdrop-blur-sm text-black rounded-xl shadow text-center">
        <p>Loading statistics...</p>
      </div>
      <section id="history-table" class="p-6 bg-white bg-opacity-80 backdrop-blur-sm text-black rounded-xl shadow text-center">
        <p>Loading game history...</p>
      </section>
    </main>
    <div class="border-t-2 border-dashed border-black my-8 w-full"></div>

      <!-- Retour Dashboard -->
      <div class="text-center">
        <a onclick="call_page('registered_user')" class="text-black underline text-base">
          ← Back to Dashboard
        </a>
      </div>
  </div>
</div>`;
      index.innerHTML = html;
      loadScripts(["/scripts/stats.js"]);
      if (pushState) window.history.pushState({ page: 'stats' }, '', '/stats');
    }
    else if (page == "modes")
    {
      html = `
      <div class="absolute w-screen h-screen z-10 bg-cover bg-no-repeat bg-fixed" style="background-image: url('/assets/background_flipped.png')"></div>
      <div id="modifiedRules" class="absolute z-10 right-5 top-5 w-40 h-16 bg-white flex justify-center items-center">
        <div class="relative z-20 w-[90%] h-[80%] bg-slate-300 flex justify-evenly items-center text-lg font-mono font-bold p-5">
          <span class="absolute left-2">Off</span>
          <span class="absolute right-2">On</span>
          <div id="slider" class="z-30 w-[47%] h-[90%] bg-[rgb(255,0,0)] absolute right-1 transition-all duration-500 flex justify-center items-center">Bonus</div>
        </div>
      </div>
      <div class="w-screen h-screen flex justify-center items-center bg-gray-100 flex-col text-black">
        <div id="back" class="text-lg font-mono font-bold left-5 top-5 z-20 absolute font-victor text-white bg-[#3CAFDA] px-3 py-1 m-2 border-0 shadow-[0px_2px_rgb(255,255,255),0px_-2px_rgb(255,255,255),2px_0px_rgb(255,255,255),-2px_0px_rgb(255,255,255),0px_4px_rgba(0,0,0,0.22),2px_2px_rgba(0,0,0,0.22),-2px_2px_rgba(0,0,0,0.22),inset_0px_2px_rgba(255,255,255,0.21)] cursor-pointer no-underline inline-block transition-transform duration-100 active:translate-y-0.5 w-fit">
          Back
        </div>
        <div id="settings" class="w-full max-w-5xl h-auto p-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto items-center justify-center z-20">
    <div></div>

    <!-- Joueur en haut (invisible par défaut) -->
    <div id="top-player" class="flex flex-col items-center justify-center invisible">
        <label class="flex flex-col sm:flex-row items-center gap-2">
            <input id="player3" onclick="botOrNot(this)" type="checkbox" class="accent-pink-600"/>Bot
            <input id="input-3" type="text" class="border rounded px-2 py-1 placeholder:text-slate-400" placeholder="Player 3" required/>
        </label>
    </div>

    <div></div>

    <!-- Joueur gauche -->
    <div id="left-player" class="flex flex-col items-center justify-center">
        <label class="flex flex-col sm:flex-row items-center gap-2">
            <input id="player1" onclick="botOrNot(this)" type="checkbox" class="accent-pink-500"/>Bot
            <input id="input-1" type="text" class="border rounded px-2 py-1 placeholder:text-slate-400" placeholder="Player 1" required/>
        </label>
    </div>

    <!-- Plateau de jeu -->
    <div id="board" class="hidden md:flex shadow-[0px_5px_#472c24,0px_-5px_#472c24,5px_0px_#472c24,-5px_0px_#472c24,0px_8px_rgba(0,0,0,0.22),5px_5px_rgba(0,0,0,0.22),-5px_5px_rgba(0,0,0,0.22),inset_0px_3px_rgba(255,255,255,0.21)] z-10 backdrop-blur-sm border-2 border-[#f4d474] relative bg-no-repeat bg-cover bg-fixed w-full max-w-[400px] h-[250px] flex justify-between items-center bg-[#314e7034]">
        <div id="countdown" class="left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[250px] text-[#ffbd42] z-30 absolute"></div>
        <div id="paddle1" class="w-[9px] h-[50px] border-[#f4d474] bg-[#32bdca] absolute left-0"></div>
        <div id="paddle2" class="w-[9px] h-[50px] bg-[#2293af] absolute right-0"></div>
        <div id="ball" class="w-[15px] h-[15px] bg-[#f4d474] absolute left-0 top-0 z-40"></div>
        <div id="bonus" class="w-[60px] h-[60px] rounded-md absolute z-40"></div>
        <div id="left-score" class="absolute text-[#bbe4deff] opacity-80 left-[25%] text-[2px] -translate-x-1/2 z-30"></div>
        <div id="right-score" class="absolute text-[#472c24] opacity-80 right-[25%] text-[2px] translate-x-1/2 z-30"></div>
    </div>

    <!-- Joueur droite -->
    <div id="right-player" class="flex flex-col items-center justify-center">
        <label class="flex flex-col sm:flex-row items-center gap-2">
            <input id="input-2" type="text" class="border rounded px-2 py-1 placeholder:text-slate-400" placeholder="Player 2" required/>Bot
            <input id="player2" onclick="botOrNot(this)" type="checkbox" class="accent-pink-500"/>
        </label>
    </div>

    <div></div>

    <!-- Joueur bas (invisible par défaut) -->
    <div id="bottom-player" class="flex flex-col items-center justify-center invisible">
        <label class="flex flex-col sm:flex-row items-center gap-2">
            <input id="player4" onclick="botOrNot(this)" type="checkbox" class="accent-pink-500"/>Bot
            <input id="input-4" type="text" class="border rounded px-2 py-1 placeholder:text-slate-400" placeholder="Player 4" required/>
        </label>
    </div>

    <div></div>
</div>

	    <div class="w-full flex flex-wrap justify-evenly gap-4 items-center p-4 z-20">
        <button onclick="mode2players()" class="relative bg-white text-black text-left font-mono font-bold text-xl w-full max-w-[400px] py-5 pl-6 pr-12 mb-2.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 h-24" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%);">
					2 players
				</button>
	    	<button onclick="mode4players()" class="relative bg-white text-black text-left font-mono font-bold text-xl w-full max-w-[400px] py-5 pl-6 pr-12 mb-2.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 h-24" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%);">
					4 players
				</button>
        <button id="confirm" class="relative bg-white text-black text-left font-mono font-bold text-xl w-full max-w-[400px] py-5 pl-6 pr-12 mb-2.5 cursor-pointer transition-all duration-300 ease-in-out hover:bg-sky-100 hover:translate-x-1 h-24" style="clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%);">
					Confirm
				</button>
	    </div>
    </div>`;
      index.innerHTML = html;
	  loadScripts(["/scripts/pong/settings.js", "/scripts/pong/game.js"]);

      if (pushState)
		window.history.pushState({ page: 'modes' }, '', '/modes');
    }
    else if (page == "pvp")
    {
      html = `
      	<button id="pause" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none absolute right-5 top-5 z-50">
        	<svg width="48" height="45" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.9999 33.4584C21.7566 33.4584 19.6052 32.5672 18.0189 30.981C16.4327 29.3947 15.5415 27.2433 15.5415 25C15.5415 22.7568 16.4327 20.6053 18.0189 19.0191C19.6052 17.4329 21.7566 16.5417 23.9999 16.5417C26.2431 16.5417 28.3946 17.4329 29.9808 19.0191C31.567 20.6053 32.4582 22.7568 32.4582 25C32.4582 27.2433 31.567 29.3947 29.9808 30.981C28.3946 32.5672 26.2431 33.4584 23.9999 33.4584ZM41.9557 27.3442C42.0524 26.5709 42.1249 25.7975 42.1249 25C42.1249 24.2025 42.0524 23.405 41.9557 22.5834L47.0549 18.6442C47.514 18.2817 47.6349 17.6292 47.3449 17.0975L42.5115 8.73588C42.2215 8.20421 41.569 7.98671 41.0374 8.20421L35.0199 10.6209C33.7632 9.67838 32.4582 8.85671 30.9357 8.25255L30.0415 1.84838C29.9924 1.56374 29.8442 1.30566 29.623 1.11988C29.4018 0.934095 29.122 0.832601 28.8332 0.833378H19.1665C18.5624 0.833378 18.0549 1.26838 17.9582 1.84838L17.064 8.25255C15.5415 8.85671 14.2365 9.67838 12.9799 10.6209L6.96236 8.20421C6.43069 7.98671 5.77819 8.20421 5.48819 8.73588L0.654856 17.0975C0.340689 17.6292 0.48569 18.2817 0.944856 18.6442L6.04402 22.5834C5.94736 23.405 5.87486 24.2025 5.87486 25C5.87486 25.7975 5.94736 26.5709 6.04402 27.3442L0.944856 31.3559C0.48569 31.7184 0.340689 32.3709 0.654856 32.9025L5.48819 41.2642C5.77819 41.7959 6.43069 41.9892 6.96236 41.7959L12.9799 39.355C14.2365 40.3217 15.5415 41.1434 17.064 41.7475L17.9582 48.1517C18.0549 48.7317 18.5624 49.1667 19.1665 49.1667H28.8332C29.4374 49.1667 29.9449 48.7317 30.0415 48.1517L30.9357 41.7475C32.4582 41.1192 33.7632 40.3217 35.0199 39.355L41.0374 41.7959C41.569 41.9892 42.2215 41.7959 42.5115 41.2642L47.3449 32.9025C47.6349 32.3709 47.514 31.7184 47.0549 31.3559L41.9557 27.3442Z" fill="white"/>
			</svg>
      	</button>
      	<span id="player1Display" class="absolute top-4 left-[100px] text-4xl text-white font-bold"></span>
		<span id="player2Display" class="absolute top-4 right-[100px] text-4xl text-white font-bold"></span>
      	<div id="board" class="-z-10 w-screen h-screen flex justify-center items-center relative bg-pink-200" style="background-image: url('/assets/pong_background.png');">
			<div id="countdown" class="text-[250px] text-[#ffbd42] z-50"></div>
			<div id="paddle1" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute left-0"></div>
			<div id="paddle2" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute right-0"></div>
			<div id="ball" class="w-[30px] h-[30px] bg-[#fff696] rounded-full absolute left-0 top-0 z-40"></div>
			<div id="bonus" class="absolute z-40 w-[64px] h-[64px] hidden bg-slate-200 rounded-full"></div>	
			<div id="separator" class="absolute w-[10px] h-[90%] bg-[#95e1ff] opacity-80 left-1/2 -translate-x-1/2 rounded-lg z-30"></div>
			<div id="left-score" class="absolute text-[#95e1ff] opacity-80 left-[25%] text-[200px] -translate-x-1/2 z-30"></div>
			<div id="right-score" class="absolute text-[#95e1ff] opacity-80 right-[25%] text-[200px] translate-x-1/2 z-30"></div>
        </div>
			</div>
			<div id="winlose" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Game Over</span>
					<span class="text-black text-[50px]" id="finalScore" class="text-5xl"></span>
				</div> 
				<button onclick="goBack('modes')" id="home" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Go Home</button>
				<button onclick="goBack('pvp')" id="retry" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Retry</button>
        		<button onclick="goTournament()" id="tournamentBtn" class="w-[300px] h-[80px] rounded-lg bg-yellow-500 hover:bg-yellow-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute hidden">Finish</button>
			</div>
      <div id="pause-page" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Pause</span>
				</div> 
				<button id="retour_pvp" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Quit</button>
				<button id="continuer" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Resume</button>
			</div>
      <div id="go_back_tournament" class="text-center mt-2">
				<a onclick="goBack('tournoi')" class="text-[#264e77] hover:underline font-semibold hidden">
					Go Back
				</a>
			</div>
		</div>`;
		index.innerHTML = html;
		loadScripts(["scripts/pong/game.js", "scripts/pong/local_1v1.js"]);
		scriptIndex = 0;
    	if (pushState)
			window.history.pushState({ page: 'pvp' }, '', '/pvp');
    }
    else if (page === "pong_4P")
    {
		html = `
      <div class="absolute h-screen w-screen bg-opacity-50 bg-black z-20 left-0"></div>
      <button id="pause" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none absolute right-5 top-5 z-50">
        <svg width="48" height="45" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.9999 33.4584C21.7566 33.4584 19.6052 32.5672 18.0189 30.981C16.4327 29.3947 15.5415 27.2433 15.5415 25C15.5415 22.7568 16.4327 20.6053 18.0189 19.0191C19.6052 17.4329 21.7566 16.5417 23.9999 16.5417C26.2431 16.5417 28.3946 17.4329 29.9808 19.0191C31.567 20.6053 32.4582 22.7568 32.4582 25C32.4582 27.2433 31.567 29.3947 29.9808 30.981C28.3946 32.5672 26.2431 33.4584 23.9999 33.4584ZM41.9557 27.3442C42.0524 26.5709 42.1249 25.7975 42.1249 25C42.1249 24.2025 42.0524 23.405 41.9557 22.5834L47.0549 18.6442C47.514 18.2817 47.6349 17.6292 47.3449 17.0975L42.5115 8.73588C42.2215 8.20421 41.569 7.98671 41.0374 8.20421L35.0199 10.6209C33.7632 9.67838 32.4582 8.85671 30.9357 8.25255L30.0415 1.84838C29.9924 1.56374 29.8442 1.30566 29.623 1.11988C29.4018 0.934095 29.122 0.832601 28.8332 0.833378H19.1665C18.5624 0.833378 18.0549 1.26838 17.9582 1.84838L17.064 8.25255C15.5415 8.85671 14.2365 9.67838 12.9799 10.6209L6.96236 8.20421C6.43069 7.98671 5.77819 8.20421 5.48819 8.73588L0.654856 17.0975C0.340689 17.6292 0.48569 18.2817 0.944856 18.6442L6.04402 22.5834C5.94736 23.405 5.87486 24.2025 5.87486 25C5.87486 25.7975 5.94736 26.5709 6.04402 27.3442L0.944856 31.3559C0.48569 31.7184 0.340689 32.3709 0.654856 32.9025L5.48819 41.2642C5.77819 41.7959 6.43069 41.9892 6.96236 41.7959L12.9799 39.355C14.2365 40.3217 15.5415 41.1434 17.064 41.7475L17.9582 48.1517C18.0549 48.7317 18.5624 49.1667 19.1665 49.1667H28.8332C29.4374 49.1667 29.9449 48.7317 30.0415 48.1517L30.9357 41.7475C32.4582 41.1192 33.7632 40.3217 35.0199 39.355L41.0374 41.7959C41.569 41.9892 42.2215 41.7959 42.5115 41.2642L47.3449 32.9025C47.6349 32.3709 47.514 31.7184 47.0549 31.3559L41.9557 27.3442Z" fill="white"/>
				</svg>
      </button>
	  		<div id="board" class="bg-no-repeat bg-cover bg-fixed z-20 aspect-square h-screen flex justify-center items-center relative bg-pink-200" style="background-image: url('/assets/pong_background.png');">
				<span id="player1Display" class="absolute top-[80%] left-0 -rotate-90 text-3xl text-white font-bold"></span>
				<span id="player2Display" class="absolute top-[15%] right-0 rotate-90 text-3xl text-white font-bold"></span>
				<span id="player3Display" class="absolute top-2 left-[100px] text-3xl text-white font-bold"></span>
				<span id="player4Display" class="absolute bottom-10 right-[100px] text-3xl text-white font-bold"></span>
				<div id="countdown" class="text-[250px] text-[#ffbd42] z-50"></div>
				<div id="ball" class="w-[30px] h-[30px] bg-[#fff696] rounded-full absolute left-0 top-0 z-40"></div>
				<div id="paddle1" class="w-[15px] h-[100px] bg-[#95e1ff] rounded-xl absolute left-0"></div>
				<div id="paddle2" class="w-[15px] h-[100px] bg-[#95e1ff] rounded-xl absolute right-0"></div>
				<div id="paddle3" class="w-[100px] h-[15px] bg-[#95e1ff] rounded-xl absolute"></div>
				<div id="paddle4" class="w-[100px] h-[15px] bg-[#95e1ff] rounded-xl absolute"></div>
				<div id="bonus" class="absolute z-40 w-[64px] h-[64px] hidden bg-slate-200 rounded-full"></div>
				<div class="absolute left-1/2 -translate-x-1/2 w-[5px] h-[120%] rotate-45 bg-[#95e1ff] opacity-80 top-1/2 -translate-y-1/2 z-30"></div>
				<div class="absolute left-1/2 -translate-x-1/2 w-[5px] h-[120%] -rotate-45 bg-[#95e1ff] opacity-80 top-1/2 -translate-y-1/2 z-30"></div>
				<div id="left-score" class="left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[#95e1ff] opacity-80 absolute text-[100px] z-30"></div>
				<div id="right-score" class="right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 text-[#95e1ff] opacity-80 absolute text-[100px] z-30"></div>
				<div id="top-score" class="top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#95e1ff] opacity-80 absolute text-[100px] z-30"></div>
				<div id="bottom-score" class="bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 text-[#95e1ff] opacity-80 absolute text-[100px] z-30"></div>
			<div id="winlose" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Game Over</span>
					<span class="text-black text-[50px]" id="finalScore" class="text-5xl"></span>
				</div>
        <button onclick="goBack('modes')" id="home" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Go Home</button>
				<button onclick="goBack('pong_4P')" id="retry" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Retry</button>
			</div>
      <div id="pause-page" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Pause</span>
				</div> 
				<button onclick="goBack('modes')" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Quit</button>
				<button id="continuer" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Resume</button>
			</div>
		</div>`;
		index.innerHTML = html;
		loadScripts(["scripts/pong/game.js"]);
		scriptIndex = 0;
		if (pushState)
			window.history.pushState({ page: "pong_4P" }, '', '/pong_4P');
    }
  	else if (page === "survival_mode")
	{
		html = `
    <button id="pause" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none absolute right-5 top-5 z-50">
        <svg width="48" height="45" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.9999 33.4584C21.7566 33.4584 19.6052 32.5672 18.0189 30.981C16.4327 29.3947 15.5415 27.2433 15.5415 25C15.5415 22.7568 16.4327 20.6053 18.0189 19.0191C19.6052 17.4329 21.7566 16.5417 23.9999 16.5417C26.2431 16.5417 28.3946 17.4329 29.9808 19.0191C31.567 20.6053 32.4582 22.7568 32.4582 25C32.4582 27.2433 31.567 29.3947 29.9808 30.981C28.3946 32.5672 26.2431 33.4584 23.9999 33.4584ZM41.9557 27.3442C42.0524 26.5709 42.1249 25.7975 42.1249 25C42.1249 24.2025 42.0524 23.405 41.9557 22.5834L47.0549 18.6442C47.514 18.2817 47.6349 17.6292 47.3449 17.0975L42.5115 8.73588C42.2215 8.20421 41.569 7.98671 41.0374 8.20421L35.0199 10.6209C33.7632 9.67838 32.4582 8.85671 30.9357 8.25255L30.0415 1.84838C29.9924 1.56374 29.8442 1.30566 29.623 1.11988C29.4018 0.934095 29.122 0.832601 28.8332 0.833378H19.1665C18.5624 0.833378 18.0549 1.26838 17.9582 1.84838L17.064 8.25255C15.5415 8.85671 14.2365 9.67838 12.9799 10.6209L6.96236 8.20421C6.43069 7.98671 5.77819 8.20421 5.48819 8.73588L0.654856 17.0975C0.340689 17.6292 0.48569 18.2817 0.944856 18.6442L6.04402 22.5834C5.94736 23.405 5.87486 24.2025 5.87486 25C5.87486 25.7975 5.94736 26.5709 6.04402 27.3442L0.944856 31.3559C0.48569 31.7184 0.340689 32.3709 0.654856 32.9025L5.48819 41.2642C5.77819 41.7959 6.43069 41.9892 6.96236 41.7959L12.9799 39.355C14.2365 40.3217 15.5415 41.1434 17.064 41.7475L17.9582 48.1517C18.0549 48.7317 18.5624 49.1667 19.1665 49.1667H28.8332C29.4374 49.1667 29.9449 48.7317 30.0415 48.1517L30.9357 41.7475C32.4582 41.1192 33.7632 40.3217 35.0199 39.355L41.0374 41.7959C41.569 41.9892 42.2215 41.7959 42.5115 41.2642L47.3449 32.9025C47.6349 32.3709 47.514 31.7184 47.0549 31.3559L41.9557 27.3442Z" fill="white"/>
				</svg>
    </button>
	<span id="player1Display" class="absolute top-4 left-[100px] text-4xl text-white font-bold z-50"></span>
	<span id="player2Display" class="absolute top-4 right-[100px] text-4xl text-white font-bold z-50"></span>
    <div id="board" class="bg-no-repeat bg-cover bg-fixed z-10 w-screen h-screen flex justify-center items-center relative bg-pink-200" style="background-image: url('/assets/pong_background.png');">
				<div id="countdown" class="text-[250px] text-[#ffbd42] z-50"></div>
				<div id="paddle1" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute left-0"></div>
				<div id="paddle2" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute right-0"></div>
				<div id="ball" class="w-[30px] h-[30px] bg-[#fff696] rounded-full absolute left-0 top-0 z-40"></div>
				<div id="bonus" class="w-[60px] h-[60px] rounded-md absolute z-40"></div>
				<div id="separator" class="absolute w-[10px] h-[90%] bg-[#95e1ff] opacity-80 left-1/2 -translate-x-1/2 rounded-lg z-30"></div>
				<div id="left-score" class="absolute text-[#95e1ff] opacity-80 left-[25%] text-[200px] -translate-x-1/2 z-30"></div>
				<div id="right-score" class="absolute text-[#95e1ff] opacity-80 right-[25%] text-[200px] translate-x-1/2 z-30"></div>
			</div>
			<div id="winlose" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Game Over</span>
					<span class="text-black text-[50px]" id="finalScore" class="text-5xl"></span>
				</div>
        		<button onclick="goBack('guest')" id="home" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Go Home</button>
				<button onclick="goBack('survival_mode')" id="retry" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Retry</button>
			</div>
      		<div id="pause-page" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Pause</span>
				</div> 
				<button onclick="goBack('registered_user')" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Quit</button>
				<button id="continuer" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Resume</button>
			</div>
		</div>`;
		index.innerHTML = html;
		loadScripts(["scripts/pong/game.js"]);
		scriptIndex = 0;
		if (pushState)
			window.history.pushState({ page: "survival_mode" }, '', '/survival_mode');
	}
  	else if (page === "pong_1vbot")
	{
		html = `
    <button id="pause" class="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-none absolute right-5 top-5 z-50">
        <svg width="48" height="45" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.9999 33.4584C21.7566 33.4584 19.6052 32.5672 18.0189 30.981C16.4327 29.3947 15.5415 27.2433 15.5415 25C15.5415 22.7568 16.4327 20.6053 18.0189 19.0191C19.6052 17.4329 21.7566 16.5417 23.9999 16.5417C26.2431 16.5417 28.3946 17.4329 29.9808 19.0191C31.567 20.6053 32.4582 22.7568 32.4582 25C32.4582 27.2433 31.567 29.3947 29.9808 30.981C28.3946 32.5672 26.2431 33.4584 23.9999 33.4584ZM41.9557 27.3442C42.0524 26.5709 42.1249 25.7975 42.1249 25C42.1249 24.2025 42.0524 23.405 41.9557 22.5834L47.0549 18.6442C47.514 18.2817 47.6349 17.6292 47.3449 17.0975L42.5115 8.73588C42.2215 8.20421 41.569 7.98671 41.0374 8.20421L35.0199 10.6209C33.7632 9.67838 32.4582 8.85671 30.9357 8.25255L30.0415 1.84838C29.9924 1.56374 29.8442 1.30566 29.623 1.11988C29.4018 0.934095 29.122 0.832601 28.8332 0.833378H19.1665C18.5624 0.833378 18.0549 1.26838 17.9582 1.84838L17.064 8.25255C15.5415 8.85671 14.2365 9.67838 12.9799 10.6209L6.96236 8.20421C6.43069 7.98671 5.77819 8.20421 5.48819 8.73588L0.654856 17.0975C0.340689 17.6292 0.48569 18.2817 0.944856 18.6442L6.04402 22.5834C5.94736 23.405 5.87486 24.2025 5.87486 25C5.87486 25.7975 5.94736 26.5709 6.04402 27.3442L0.944856 31.3559C0.48569 31.7184 0.340689 32.3709 0.654856 32.9025L5.48819 41.2642C5.77819 41.7959 6.43069 41.9892 6.96236 41.7959L12.9799 39.355C14.2365 40.3217 15.5415 41.1434 17.064 41.7475L17.9582 48.1517C18.0549 48.7317 18.5624 49.1667 19.1665 49.1667H28.8332C29.4374 49.1667 29.9449 48.7317 30.0415 48.1517L30.9357 41.7475C32.4582 41.1192 33.7632 40.3217 35.0199 39.355L41.0374 41.7959C41.569 41.9892 42.2215 41.7959 42.5115 41.2642L47.3449 32.9025C47.6349 32.3709 47.514 31.7184 47.0549 31.3559L41.9557 27.3442Z" fill="white"/>
				</svg>
    </button>
	<span id="player1Display" class="absolute top-4 left-[100px] text-4xl text-white font-bold z-50"></span>
	<span id="player2Display" class="absolute top-4 right-[100px] text-4xl text-white font-bold z-50"></span>
    <div id="board" class="bg-no-repeat bg-cover bg-fixed z-10 w-screen h-screen flex justify-center items-center relative bg-pink-200" style="background-image: url('/assets/pong_background.png');">
				<div id="countdown" class="text-[250px] text-[#ffbd42] z-50"></div>
				<div id="paddle1" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute left-0"></div>
				<div id="paddle2" class="w-[20px] h-[150px] bg-[#95e1ff] rounded-xl absolute right-0"></div>
				<div id="ball" class="w-[30px] h-[30px] bg-[#fff696] rounded-full absolute left-0 top-0 z-40"></div>
				<div id="bonus" class="w-[60px] h-[60px] rounded-md absolute z-40"></div>
				<div id="separator" class="absolute w-[10px] h-[90%] bg-[#95e1ff] opacity-80 left-1/2 -translate-x-1/2 rounded-lg z-30"></div>
				<div id="left-score" class="absolute text-[#95e1ff] opacity-80 left-[25%] text-[200px] -translate-x-1/2 z-30"></div>
				<div id="right-score" class="absolute text-[#95e1ff] opacity-80 right-[25%] text-[200px] translate-x-1/2 z-30"></div>
			</div>
			</div>
      <div id="winlose" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-lg bg-green-50 z-50 hidden flex flex-col items-center p-10 pb-16">

  <!-- Partie Game Over + Score -->
  <div class="flex flex-col items-center gap-5 text-black">
    <span class="text-[50px] font-semibold">Game Over</span>
    <span id="finalScore" class="text-[40px] font-semibold"></span>
  </div>

  <!-- Boutons en bas -->
  <div class="flex justify-between w-full px-10 mt-auto">
    <button onclick="goBack('guest')" id="home" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 text-slate-50 font-semibold flex justify-center items-center">
      Go Home
    </button>
    <button onclick="goBack('pong_1vbot')" id="retry" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 text-slate-50 font-semibold flex justify-center items-center">
      Retry
    </button>
  </div>

</div>
      <div id="pause-page" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-lg bg-green-50 z-50 hidden">
				<div class="absolute font-semibold w-[600px] h-[160px] left-1/2 -translate-x-1/2 top-1/6 flex flex-col gap-5 justify-center items-center text-7xl">
					<span class="text-black text-[50px]">Pause</span>
				</div> 
				<button onclick="goBack('registered_user')" class="w-[300px] h-[80px] rounded-lg bg-red-500 hover:bg-red-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold left-[50px] top-[70%] absolute">Quit</button>
				<button id="continuer" class="w-[300px] h-[80px] rounded-lg bg-blue-500 hover:bg-blue-600 hover:text-slate-300 flex justify-center items-center text-slate-50 font-semibold right-[50px] top-[70%] absolute">Resume</button>
			</div>
		</div>`;
		index.innerHTML = html;
		loadScripts(["scripts/pong/game.js"]);
		scriptIndex = 0;
		if (pushState)
			window.history.pushState({ page: "pong_1vbot" }, '', '/pong_1vbot');
  	}
    else if (page == "index" || page === "")
    {
      html = `
      <div class="absolute inset-0 bg-black/[0.185] z-0"></div>
      
      <!-- Particules-->
      <div id="particles" class="absolute inset-0 z-10"></div>
      
      <div class="relative z-20 flex flex-col items-center">
        <h1 class="text-6xl font-bold text-center mb-20 font-victor text-white drop-shadow-text">
          Solar Transcendence
        </h1>
        <div class="bg-[rgba(39,91,131,0.21)] border-4 border-white/80 px-32 py-12 shadow-[0px_3px_white,0px_-3px_white,3px_0px_white,-3px_0px_white,0px_6px_rgba(0,0,0,0.22),3px_3px_rgba(0,0,0,0.22),-3px_3px_rgba(0,0,0,0.22),inset_0px_3px_rgba(255,255,255,0.21)] animate-float" style="animation-delay: 0.5s;">
          <h2 class="text-lg font-victor text-white mb-8 tracking-wider text-center">MISSION CONTROL</h2>
          
          <div class="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>
          
          <div class="flex gap-12 mb-12 justify-center">
            <a onclick="call_page('login')"  class="font-victor text-white bg-[#3CAFDA] px-10 py-4 m-2 text-lg border-0 shadow-[0px_2px_rgb(255,255,255),0px_-2px_rgb(255,255,255),2px_0px_rgb(255,255,255),-2px_0px_rgb(255,255,255),0px_4px_rgba(0,0,0,0.22),2px_2px_rgba(0,0,0,0.22),-2px_2px_rgba(0,0,0,0.22),inset_0px_2px_rgba(255,255,255,0.21)] cursor-pointer no-underline inline-block transition-transform duration-100 active:translate-y-0.5">
              Login
            </a>
            <a onclick="call_page('register')" class="font-victor text-white bg-[#3CAFDA] px-10 py-4 m-2 text-lg border-0 shadow-[0px_2px_rgb(255,255,255),0px_-2px_rgb(255,255,255),2px_0px_rgb(255,255,255),-2px_0px_rgb(255,255,255),0px_4px_rgba(0,0,0,0.22),2px_2px_rgba(0,0,0,0.22),-2px_2px_rgba(0,0,0,0.22),inset_0px_2px_rgba(255,255,255,0.21)] cursor-pointer no-underline inline-block transition-transform duration-100 active:translate-y-0.5">
              Register
            </a>
          </div>
          
          <div class="text-center mb-8">
            <div class="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>
            <a onclick="call_page('guest')" class="font-victor text-white bg-[#3CAFDA] px-10 py-4 m-2 text-lg border-0 shadow-[0px_2px_rgb(255,255,255),0px_-2px_rgb(255,255,255),2px_0px_rgb(255,255,255),-2px_0px_rgb(255,255,255),0px_4px_rgba(0,0,0,0.22),2px_2px_rgba(0,0,0,0.22),-2px_2px_rgba(0,0,0,0.22),inset_0px_2px_rgba(255,255,255,0.21)] cursor-pointer no-underline inline-block transition-transform duration-100 active:translate-y-0.5">
              Continue as Guest
            </a>
          </div>
          
          <div class="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>
          
          <div class="flex justify-center items-center gap-4 pt-6">
            <span class="text-xs font-victor text-white-600 tracking-wider">SYSTEM STATUS</span>
            <div class="flex gap-2">
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse-green"></div>
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse-green" style="animation-delay: 0.3s;"></div>
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse-green" style="animation-delay: 0.6s;"></div>
            </div>
            <span class="text-xs font-victor text-green-400 tracking-wider">ONLINE</span>
          </div>
        </div>
      </div>
    `;
    index.innerHTML = html;
    
    // Re-create particles for home page
    setTimeout(() => {
      const particlesContainer = document.getElementById('particles');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2.5 h-2.5 bg-white/40 rounded-full pointer-events-none animate-particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 20 + 's';
          particle.style.animationDuration = (15 + Math.random() * 10) + 's';
          particlesContainer.appendChild(particle);
        }
      }
    }, 100);
    
    if (pushState) window.history.pushState({ page: 'index' }, '', '/');
  }
  else
  {
    index.innerHTML = `<div class="w-screen h-screen flex justify-center items-center">
        <h1 class='text-6xl'>Error 404: Page not found</h1>
      </div>`;
      if (pushState)
			window.history.pushState({ page: `${page}` }, '', `/${page}`); 
  }
}

function loadScript(src: string, index: number) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.id = `page-script${index}`;
    script.onload = resolve;
    script.onerror = reject;
    script.type = "text/javascript";
    document.body.appendChild(script);
  });
}

function loadScripts(srcs: string[], callback?: () => void) {
	if (srcs.length === 0) {
		callback?.();
		return;
	}
	loadScript(srcs[0], scriptIndex++).then(() => {
		loadScripts(srcs.slice(1), callback);
	}).catch((err) => {
		console.error("Erreur de chargement du script :", srcs[0], err);
		loadScripts(srcs.slice(1), callback);
	});
}

function removeScripts() {
	let i = 0;
	let script = document.getElementById(`page-script${i++}`);
	while (script)
	{
		script.remove();
		script = document.getElementById(`page-script${i++}`);
	}
}

window.addEventListener('popstate', (event) => {
  	let page = event.state?.page;
  	if (!page) {
    	const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    	page = path === '' ? 'index' : path;
	}
	if (page === "pvp" && localStorage.getItem("gameMode") !== "1v1" || page === "pong_4P" && localStorage.getItem("gameMode") !== "1v1v1v1")
		return goBack(localStorage.getItem("token") ? "registered_user" : "modes");
  	if (page === "survival_mode" && localStorage.getItem("gameMode") !== "survival_mode" || page === "pong_1vbot" && localStorage.getItem("gameMode") !== "1v1")
    	return goBack("registered_user");
	goBack(page);
});

window.call_page = call_page;

function goBack(page: string) {
	resetGame();
	call_page(page);
}

function resetGame() {
	if (animationId)
		cancelAnimationFrame(animationId);
	if (botViewInterval)
		clearInterval(botViewInterval);
	if (interval)
	{
		clearInterval(interval);
		interval = undefined;
	}
	player1 = undefined;
	player2 = undefined;
	player3 = undefined;
	player4 = undefined;
}