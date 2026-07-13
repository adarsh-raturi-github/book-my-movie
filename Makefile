install-strimzi:
	kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -

	kubectl apply -f "https://strimzi.io/install/latest?namespace=kafka" -n kafka

	kubectl wait deployment/strimzi-cluster-operator \
		--for=condition=Available \
		--timeout=180s \
		-n kafka
setup-kafka:
	kubectl apply -k infra/kafka

	kubectl wait kafka/bookmymovie \
		--for=condition=Ready \
		--timeout=300s \
		-n kafka

dev:
	skaffold dev

skaffold-delete: 
	skaffold delete	

clean-kafka:
	kubectl delete kafkaconnector --all -n kafka --ignore-not-found

	kubectl delete kafkatopic --all -n kafka --ignore-not-found

	kubectl wait --for=delete kafkatopic --all -n kafka --timeout=180s || true

	kubectl delete kafka bookmymovie -n kafka --ignore-not-found

	kubectl wait --for=delete kafka/bookmymovie -n kafka --timeout=300s || true

	kubectl delete namespace kafka --ignore-not-found