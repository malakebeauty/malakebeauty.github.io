async function fadeInBody () {
    var children = document.body.childNodes;
    for (var child of children) {
        child.style = "opacity: 0;";
    }
    sleep(1000)
    for (var child of children) {
        child.style = "animation-name: fadeIn; animation-duration: 1s;";
        if (child.className == "intro-container") {
            // text typing animation
            var description = document.getElementById('description');
            var savedText = description.innerHTML;
            description.innerHTML = '';
            for (var char of savedText) {
                description.innerHTML += char;
                await sleep(1);
            }
        }
        else if (child.className == "work-samples") {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
            	if (this.readyState == 4 && this.status == 200) {
            		var resp = JSON.parse(this.responseText);
            	    for (var post of resp) {
                        console.log(post);
                        document.getElementsByClassName("work-samples")[0].innerHTML += `
                        <div class="work-sample">
                            <img class="work-sample-thumb" src="${post.thumbnail.url}" alt="[POST-THUMB]" width="${post.thumbnail.width}" height="${post.thumbnail.height}"/>
                            <div class="work-sample-content">
                                <div class="work-sample-content-icons">
                                    <i class="fa fa-heart like"> ${post.like_count} </i>
                                    <i class="fa fa-comment comment"> ${post.comment_count} </i>
                                </div>
                                <p class="work-sample-caption">${post.caption_text}</p>
                                <button class="work-sample-content-refrence" onclick="goto('https://instagram.com/p/${post.code}');">نمایش در اینستاگرام</button>
                            </div>
                        </div>
                        `;
                    }
            	}
            };
            var t = new Date();
            xhr.open("GET", `dist/db/posts.json?${t.getTime()}`, false);
            xhr.send();
        }
        await sleep(300)
    }
}

var objCal2 = new AMIB.persianCalendar( 'pcal2', {
    initialDate: new Date().toLocaleDateString('fa-IR').replace(/۰/g, 0).replace(/۱/g, 1).replace(/۲/g, 2).replace(/۳/g, 3).replace(/۴/g, 4).replace(/۵/g, 5).replace(/۶/g, 6).replace(/۷/g, 7).replace(/۸/g, 8).replace(/۹/g, 9),
});
document.getElementById("time").value = `${new Date().getHours()}:${new Date().getMinutes()}`;
document.getElementById("submitOrder").onclick = () => {
    let now = {"date": new Date().toLocaleDateString('fa-IR').replace(/۰/g, 0).replace(/۱/g, 1).replace(/۲/g, 2).replace(/۳/g, 3).replace(/۴/g, 4).replace(/۵/g, 5).replace(/۶/g, 6).replace(/۷/g, 7).replace(/۸/g, 8).replace(/۹/g, 9), "time": new Date().getHours()+":"+new Date().getMinutes()};
    let select = {"date": document.getElementById("pcal2").value, "time": document.getElementById("time").value};
    
    now.date = {"year": now.date.split("/")[0]*1,"month": now.date.split("/")[1]*1,"day": now.date.split("/")[2]*1}
    select.date = {"year": select.date.split("/")[0]*1,"month": select.date.split("/")[1]*1,"day": select.date.split("/")[2]*1}
    now.time = {"hour": now.time.split(":")[0]*1, "minute": now.time.split(":")[1]*1};
    select.time = {"hour": select.time.split(":")[0]*1, "minute": select.time.split(":")[1]*1};
    var differents = {"date": {"year": select.date.year - now.date.year, "month": select.date.month - now.date.month, "day": select.date.day - now.date.day}, "time": {"hour": select.time.hour - now.time.hour, "minute": select.time.minute - now.time.minute}}
    // (-n (<0) : select > now) | (0 : select == now) | (+n (>0) : select < now)

	if (document.getElementById("time").value !== "") {
	    if (differents.date.year == 0 && differents.date.month >= 0 && (differents.date.month == 0 ? differents.date.day >= 0 : true)) {
	        // date is vaild
	        if (differents.time.hour == 0 && differents.date.month == 0 && differents.date.day == 0 ? differents.time.minute >= 0 : true) {
	            // time is vaild
				if (7 < select.time.hour && select.time.hour < 23 ) {
					// time is in range
					// TODO : send request to server for submit selected datetime
					const Toast = Swal.mixin({
						toast: true,
						position: 'top-end',
						showConfirmButton: false,
						timer: 3000,
						timerProgressBar: true,
						didOpen: (toast) => {
						  toast.addEventListener('mouseenter', Swal.stopTimer)
						  toast.addEventListener('mouseleave', Swal.resumeTimer)
						}
					});
					Toast.fire({
						icon: 'success',
						title: 'نوبت شما با موفقیت رزرو شد'
					})
				}
	        	else {
	        		Swal.fire({
	        			icon: 'error',
	        			title: '!اوه',
	        			text: 'زمان انتخاب شده جزو ساعت کاری ما (۸ صبح تا ۲۲ شب) نیست',
	        	  	})
	        	}
	        } else {
	            // time is invalid
	            Swal.fire({
	        		icon: 'error',
	        		title: '!اوه',
	        		text: 'زمان انتخاب شده گذشته است! لطفا یک زمان در آینده را برگزینید',
	        	})
	        }
	    } else {
	        // date is invalid
	        Swal.fire({
				icon: 'error',
	        	title: '!اوه',
	        	text: 'تاریخ انتخاب شده گذشته است! لطفا یک تاریخ در آینده را برگزینید',
	        })
	    }
	} else {
		Swal.fire({
        	icon: 'error',
       		title: '!اوه',
       		text: 'شما هنوز زمانی را برای نوبت خود انتخاب نکرده‌اید',
   		})
	}
}

function goto(link) {
    window.location = link;
}
async function sleep(ms) {
	return await new Promise(resolve => setTimeout(resolve, ms));
}