/*

Rotate Different Ad Networks Based on Interval

3 or more Ad Networks need to be rotated at time intervals tied to the visiting user.

If the User Leaves the Site After being shown 2 of the ad networks, next time they visit they will start with the 
3rd ad network.

The First Ad network will expire after 5 minutes
The Second Ad Network will expire after 2 minutes
Every Ad network after the 2ND will expire after 1 minute

After each expiration the current network will be removed, and the next one in order will be added. 

Local Storage will be used for saving the current script index from the array of scripts

*/

(function() {
    const scripts = [ // array of scripts to load
         'https://domain1.com/assets/js/adnetwork1.js',
         'https://domain2.com/assets/js/adnetwork2.js',
         'https://domain3.com/assets/js/adnetwork3.js',
         'https://domain4.com/assets/js/adnetwork4.js',
         'https://domain5.com/assets/js/adnetwork5.js',
         'console.log("inline code to be used with eval")'
    ];

    let currentIndex = parseInt(localStorage.getItem('currentAdIndex')) || 0;
    const loadTimes = [300000, 120000]; // Load times for the first two scripts in milliseconds (5 mins, 2 mins)
    const interval = 60000; // Default interval for subsequent scripts (1 min)

    const getFormattedDateTime = () => new Date().toISOString(); // Get the current date and time formatted as a string

    // Function to load a script based on the current index
    const loadScript = (index) => {
        console.log(`[${getFormattedDateTime()}] Loading script at index: ${index}`); // Log the current index
        index = index >= scripts.length ? 0 : index; // Reset index to 0 if it exceeds the length

        const script = scripts[index]; // Get the current script
        const loadNext = () => {
            const loadTime = index < 2 ? loadTimes[index] : interval;
            console.log(`[${getFormattedDateTime()}] Scheduling next script load in ${loadTime} ms`); // Log the load time
            setTimeout(() => {
                // Remove previously loaded scripts
                document.querySelectorAll('.cj92ka').forEach(script => {
                    console.log(`[${getFormattedDateTime()}] Removing script: ${script.src || 'inline script'}`); // Log the removal of the script
                    script.remove();
                });
                // Load the next script in a circular manner
                loadScript((index + 1) % scripts.length);
            }, loadTime); // Use specific load times for the first two scripts
        };

        // Check if the script is a URL or inline code
        if (script.startsWith('http')) {
            const scriptElement = document.createElement('script'); // Create a new script element
            scriptElement.src = script; // Set the source to the script URL
            scriptElement.className = 'cj92ka'; // Assign a class for easy removal
            scriptElement.onload = () => {
                console.log(`[${getFormattedDateTime()}] Script loaded: ${script}`); // Log successful script load
                loadNext(); // Load the next script after this one is loaded
            };
            document.head.appendChild(scriptElement); // Append the script to the document head
        } else {
            try {
                console.log(`[${getFormattedDateTime()}] Executing inline script`); // Log inline script execution
                eval(script); // Execute inline script
            } catch (error) {
                console.error(`[${getFormattedDateTime()}] Error executing inline script:`, error); // Log any errors during execution
            }
            loadNext(); // Proceed to load the next script
        }

        localStorage.setItem('currentAdIndex', index); // Store the current index in local storage
        console.log(`[${getFormattedDateTime()}] Current index stored: ${index}`); // Log the stored index
    };

    // Start loading scripts once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`[${getFormattedDateTime()}] DOM fully loaded, starting script loading`); // Log when DOM is ready
        loadScript(currentIndex);
    });
})();
