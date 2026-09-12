// const navToggle = document.getElementById('navToggle');
// const navLinks = document.getElementById('navLinks');

// if (navToggle && navLinks) {
//   navToggle.addEventListener('click', () => {
//     const open = navLinks.classList.toggle('nav-open');
//     navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
//   });

//   navLinks.querySelectorAll('a').forEach((link) => {
//     link.addEventListener('click', () => {
//       navLinks.classList.remove('nav-open');
//     });
//   });
// }


/* =========================
   MOBILE NAVIGATION
========================= */

const navToggle = document.getElementById('navToggle');

const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {

  navToggle.addEventListener('click', () => {

    const open = navLinks.classList.toggle('nav-open');

    navToggle.setAttribute(
      'aria-expanded',
      open ? 'true' : 'false'
    );

  });


  navLinks.querySelectorAll('a').forEach((link) => {

    link.addEventListener('click', () => {

      navLinks.classList.remove('nav-open');

    });

  });

}


/* =========================
   REVIEWS / FEEDBACK
========================= */

const reviewForm = document.getElementById("reviewForm");

const reviewsList = document.getElementById("reviewsList");


// Get saved reviews
let reviews =
  JSON.parse(localStorage.getItem("shifaReviews")) || [];


// Reviews shown per page
const reviewsPerPage = 3;


// Current review page
let currentReviewPage = 0;


/* =========================
   DISPLAY REVIEWS
========================= */

function displayReviews() {

  if (!reviewsList) {
    return;
  }


  // Clear existing reviews
  reviewsList.innerHTML = "";


  // Navigation elements
  const reviewsNavigation =
    document.getElementById("reviewsNavigation");

  const prevReviews =
    document.getElementById("prevReviews");

  const nextReviews =
    document.getElementById("nextReviews");

  const reviewPage =
    document.getElementById("reviewPage");


  /* =========================
     NO REVIEWS
  ========================= */

  if (reviews.length === 0) {

    reviewsList.innerHTML = `
      <p style="text-align:center; grid-column:1/-1;">
        Be the first person to leave a review!
      </p>
    `;


    if (reviewsNavigation) {
      reviewsNavigation.style.display = "none";
    }


    return;
  }


  /* =========================
     CALCULATE PAGES
  ========================= */

  const totalPages =
    Math.ceil(reviews.length / reviewsPerPage);


  // Make sure page still exists
  if (currentReviewPage >= totalPages) {

    currentReviewPage =
      totalPages - 1;

  }


  /* =========================
     GET CURRENT 3 REVIEWS
  ========================= */

  const startIndex =
    currentReviewPage * reviewsPerPage;

  const endIndex =
    startIndex + reviewsPerPage;

  const currentReviews =
    reviews.slice(startIndex, endIndex);


  /* =========================
     CREATE REVIEW CARDS
  ========================= */

  currentReviews.forEach((review) => {

    const firstLetter =
      review.name.charAt(0).toUpperCase();


    const card =
      document.createElement("div");


    card.className = "review-card";


    card.innerHTML = `

      <div
        class="review-stars"
        aria-label="${review.rating} out of 5 stars"
      >

        ${"★".repeat(review.rating)}

        <span style="opacity:0.25;">
          ${"★".repeat(5 - review.rating)}
        </span>

      </div>


      <p class="review-text">
        "${escapeHTML(review.message)}"
      </p>


      <div class="review-author">

        <div class="review-avatar">
          ${escapeHTML(firstLetter)}
        </div>


        <div>

          <h3>
            ${escapeHTML(review.name)}
          </h3>

          <span>
            Customer
          </span>

        </div>

      </div>

    `;


    reviewsList.appendChild(card);

  });


  /* =========================
     REVIEW NAVIGATION
  ========================= */

  if (reviewsNavigation) {

    if (reviews.length > reviewsPerPage) {

      reviewsNavigation.style.display = "flex";

    } else {

      reviewsNavigation.style.display = "none";

    }

  }


  /* =========================
     PAGE NUMBER
  ========================= */

  if (reviewPage) {

    reviewPage.textContent =
      `${currentReviewPage + 1} / ${totalPages}`;

  }


  /* =========================
     PREVIOUS BUTTON
  ========================= */

  if (prevReviews) {

    prevReviews.disabled =
      currentReviewPage === 0;

  }


  /* =========================
     NEXT BUTTON
  ========================= */

  if (nextReviews) {

    nextReviews.disabled =
      currentReviewPage === totalPages - 1;

  }

}


/* =========================
   SUBMIT REVIEW
========================= */

if (reviewForm) {

  reviewForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      /* =========================
         GET FORM VALUES
      ========================= */

      const name =
        document
          .getElementById("reviewName")
          .value
          .trim();


      const rating =
        Number(
          document
            .getElementById("reviewRating")
            .value
        );


      const message =
        document
          .getElementById("reviewMessage")
          .value
          .trim();


      /* =========================
         VALIDATION
      ========================= */

      if (!name || !rating || !message) {

        alert(
          "Please fill in all fields."
        );

        return;

      }


      /* =========================
         CREATE NEW REVIEW
      ========================= */

      const newReview = {

        name: name,

        rating: rating,

        message: message

      };


      /* =========================
         ADD REVIEW TO BEGINNING
      ========================= */

      reviews.unshift(newReview);


      /* =========================
         SAVE REVIEW
      ========================= */

      localStorage.setItem(
        "shifaReviews",
        JSON.stringify(reviews)
      );


      /* =========================
         GO TO FIRST PAGE
      ========================= */

      currentReviewPage = 0;


      /* =========================
         DISPLAY REVIEWS
      ========================= */

      displayReviews();


      /* =========================
         CLEAR FORM
      ========================= */

      reviewForm.reset();


      /* =========================
         SUCCESS MESSAGE
      ========================= */

      alert(
        "Thank you! Your review has been submitted."
      );

    }
  );

}


/* =========================
   PREVIOUS REVIEWS
========================= */

const prevReviews =
  document.getElementById("prevReviews");


if (prevReviews) {

  prevReviews.addEventListener(
    "click",
    () => {

      if (currentReviewPage > 0) {

        currentReviewPage--;

        displayReviews();

      }

    }
  );

}


/* =========================
   NEXT REVIEWS
========================= */

const nextReviews =
  document.getElementById("nextReviews");


if (nextReviews) {

  nextReviews.addEventListener(
    "click",
    () => {

      const totalPages =
        Math.ceil(
          reviews.length / reviewsPerPage
        );


      if (
        currentReviewPage <
        totalPages - 1
      ) {

        currentReviewPage++;

        displayReviews();

      }

    }
  );

}


/* =========================
   PROTECT REVIEW HTML
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================
   LOAD REVIEWS
========================= */

if (reviewsList) {

  displayReviews();

}