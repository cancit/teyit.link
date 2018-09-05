package utils

import (
	"encoding/json"
	"fmt"
	"github.com/satori/go.uuid"
	"gitlab.com/nod/teyit/link/database"
	"os"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
)

type archiveRequest struct {
	RequestUrl string    `json:"request_url"`
	ArchiveId  uuid.UUID `json:"archive_id"`
}

type getItemsResponseError struct {
	Message string `json:"message"`
}

type getItemsResponseData struct {
	Item string `json:"item"`
}

type getItemsResponseBody struct {
	Result string                 `json:"result"`
	Data   []getItemsResponseData `json:"data"`
	Error  getItemsResponseError  `json:"error"`
}

type getItemsResponseHeaders struct {
	ContentType string `json:"Content-Type"`
}

type getItemsResponse struct {
	StatusCode int                     `json:"statusCode"`
	Headers    getItemsResponseHeaders `json:"headers"`
	Body       getItemsResponseBody    `json:"body"`
}

func RunArchiveLambda(archiveRecord *database.Archive) {
	// Create Lambda service client
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	client := lambda.New(sess, &aws.Config{Region: aws.String("eu-central-1")})

	// Create the archive request for Lambda
	request := archiveRequest{archiveRecord.RequestUrl, archiveRecord.ArchiveID}
	payload, err := json.Marshal(request)

	if err != nil {
		fmt.Println("Error marshalling archive request")
		os.Exit(0)
	}

	result, err := client.Invoke(&lambda.InvokeInput{
		FunctionName: aws.String("teyitlink-archive"),
		Payload:      payload,
	})

	if err != nil {
		fmt.Println("Error calling the lambda")
		os.Exit(0)
	}

	var resp getItemsResponse

	err = json.Unmarshal(result.Payload, &resp)

	if err != nil {
		fmt.Println("Error unmarshalling MyGetItemsFunction response")
		os.Exit(0)
	}

	// If the status code is NOT 200, the call failed
	if resp.StatusCode != 200 {
		fmt.Println("Error getting items, StatusCode: " + strconv.Itoa(resp.StatusCode))
		os.Exit(0)
	}

	// If the result is failure, we got an error
	if resp.Body.Result == "failure" {
		fmt.Println("Failed to get items")
		os.Exit(0)
	}

	// Print out items
	if len(resp.Body.Data) > 0 {
		for i := range resp.Body.Data {
			fmt.Println(resp.Body.Data[i].Item)
		}
	} else {
		fmt.Println("There were no items")
	}
}
