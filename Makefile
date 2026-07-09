setup:
	kubectl create namespace kafka --dry-run=client -o yaml | kubectl apply -f -
	kubectl apply -f "https://strimzi.io/install/latest?namespace=kafka" -n kafka
	kubectl wait deployment/strimzi-cluster-operator \
		--for=condition=Available \
		--timeout=180s \
		-n kafka

dev:
	skaffold dev

clean:
	-kubectl delete kafkatopic --all -n kafka --ignore-not-found --wait=false
	@sleep 5
	-kubectl delete kafka bookmymovie -n kafka --ignore-not-found --wait=false
	-kubectl delete pvc --all -n kafka --ignore-not-found --wait=false