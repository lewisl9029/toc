VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision "shell" do |s|
    s.inline = "apt-get update && apt-get install -y docker.io"
  end
end
