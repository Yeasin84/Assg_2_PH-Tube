const contents = document.getElementById("content-container");
    const categories = document.getElementById("categories-container");
    let increase = true;
    let data = null;

    fetchData(1000);

    fetch("https://openapi.programming-hero.com/api/videos/categories")
        .then(res => res.json())
        .then(doc => {
            doc.data.forEach(element => {
                const categoryDiv = createCategoryElement(element);
                categories.appendChild(categoryDiv);
            });
        });

    function createCategoryElement(element) {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = 'category bg-rose-600 w-20 mt-4 py-2 text-center text-slate-50 rounded';
        categoryDiv.addEventListener("click", () => {
            fetchData(element.category_id);
            increase = true;
        });

        categoryDiv.innerHTML = element.category;
        return categoryDiv;
    }

    function fetchData(id) {
        contents.innerHTML = '';

        fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
            .then(res => res.json())
            .then(doc => {
                data = doc.data;

                if (doc.status == false) {
                    data = null;
                    contents.innerHTML = `<div class="flex items-center justify-center gap-6">
                                            <img src="../images/Icon.png" alt="not found"/>
                                            <h1 class="text-4xl font-bold">Oops!! Sorry, There is no content here</h1>
                                        </div>`;
                    return;
                }

                doc.data.forEach(element => {
                    const videoDiv = createVideoElement(element);
                    contents.appendChild(videoDiv);
                });
            });
    }

    function createVideoElement(element) {
        const timeInfo = msToTime(parseInt(element.others.posted_date));
        const videoDiv = document.createElement("div");
        videoDiv.className = 'video relative';
        videoDiv.style.width = "312px"
        videoDiv.style.height = "325px"
        videoDiv.innerHTML = `
            <div class="group grid relative">
                <img src="${element.thumbnail}" alt="thumbnail" style="border-radius: 2%; width:312px; height:200px; object-cover" class="thumbnail">
                <span class="time-info absolute bottom-0 right-0 p-2 bg-white bg-opacity-75 text-sm text-gray-500"> Uploaded :
                ${timeInfo.hours} hr ${timeInfo.minutes} min ${timeInfo.seconds} sec ago
               </span>
            </div>
            <div class="video-data flex flex-col justify-between mt-3">
                <div>
                    <h3 class="font-bold">${element.title}</h3>
                    <div class="flex items-center gap-2">
                        <img src="${element.authors[0].profile_picture}" alt="pfp" style="width:40px; height:40px; border-radius:50%;>
                        <div>
                            <small class="text-gray-500">${element.authors[0].profile_name}</small>
                            ${(element.authors[0].verified == true) ? `<i class=" mx-2 fa-solid fa-circle-check text-blue-500"></i>`:'<p></p>'}
                        </div>
                    </div>
                </div>
                <div>
                    <small class="text-gray-500">${element.others.views} Views</small>
                </div>
            </div>`;

        return videoDiv;
    }

    function sortByView() {
        if (data == null) {
            return;
        }

        increase = !increase;
        data.sort((a, b) => {
            const aViews = parseFloat(a.others.views.slice(0, -1));
            const bViews = parseFloat(b.others.views.slice(0, -1));

            return increase ? bViews - aViews : aViews - bViews;
        });

        contents.innerHTML = '';
        data.forEach(element => {
            const videoDiv = createVideoElement(element);
            contents.appendChild(videoDiv);
        });
    }

    function msToTime(s) {
        function pad(n, z) {
            z = z || 2;
            return ('00' + n).slice(-z);
        }
    
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
    
        return {
            hours: pad(hrs),
            minutes: pad(mins),
            seconds: pad(secs),
        };
    }
    