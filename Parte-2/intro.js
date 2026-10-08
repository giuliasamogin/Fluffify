/* FLUFFIFY — controle da intro. O HTML da intro fica no index.html e o visual no style.css. */
document.addEventListener('DOMContentLoaded',()=>{
 const intro=document.getElementById('fluffifyIntro');
 if(!intro)return;
 const finish=()=>{intro.classList.add('hide');sessionStorage.setItem('fluffify_intro_seen','1');setTimeout(()=>intro.remove(),900)};
 document.getElementById('skipIntro')?.addEventListener('click',finish);
 if(sessionStorage.getItem('fluffify_intro_seen')){intro.remove();return;}
 setTimeout(finish,5200);
});
