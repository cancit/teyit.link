package handlers

import (
	"fmt"
	"github.com/noddigital/teyit.link/database"
	"github.com/noddigital/teyit.link/utils"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func CreateArchiveHandler(w http.ResponseWriter, r *http.Request) {
	archive, fresh, err := createArchive(r)

	if err != nil {
		RespondError(w, r, err)
		return
	}

	config := utils.GetConfig()
	returnUrl := strings.Builder{}
	returnUrl.WriteString(fmt.Sprintf("%s/%s", config.BaseUrl, archive.Slug))

	if fresh == true {
		returnUrl.WriteString("?fresh=false")
	}

	http.Redirect(w, r, returnUrl.String(), http.StatusFound)
}

func CreateArchiveApiHandler(w http.ResponseWriter, r *http.Request) {
	archive, fresh, err := createArchive(r)

	if err != nil {
		RespondError(w, r, err)
		return
	}

	if fresh == true {
		w.WriteHeader(http.StatusCreated)
	}

	RespondJson(w, archive.GetAsPublic())
}

func createArchive(r *http.Request) (*database.Archive, bool, error) {
	requestUrl := r.FormValue("request_url")
	callbackUrl := r.FormValue("callback_url")
	force, _ := strconv.ParseBool(r.FormValue("force"))

	if force != true {
		previous, err := database.CountArchivesByRequestUrl(requestUrl)

		if err != nil {
			log.Println("Error while counting previous archives", err)
			return nil, false, err
		}

		if previous.Count > 0 {
			return &previous.LastArchive, false, nil
		}
	}

	archive := &database.Archive{RequestUrl: requestUrl, CallbackUrl: callbackUrl}
	err := archive.Save(false)

	if err != nil {
		return nil, false, err
	}

	return archive, true, nil
}
