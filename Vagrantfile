VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "puphpet/ubuntu1404-x64"
  config.vm.provision :shell, path: "scripts/toc-setup-env.sh",
    args: "
      #{ENV['TOC_HOST_IP']} \
      #{ENV['JSPM_GITHUB_AUTH_TOKEN']} \
      #{ENV['IONIC_EMAIL']} \
      #{ENV['IONIC_PASSWORD']} \
    ",
    privileged: false
  config.vm.provision :shell, path: "scripts/toc-setup-vagrant.sh",
    privileged: false

  # toc ports
  config.vm.network "forwarded_port", guest: 8100, host: 8100 # http server
  config.vm.network "forwarded_port", guest: 8101, host: 8101 # livereload

  config.vm.synced_folder ".", "/home/vagrant/toc"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider "virtualbox" do |vm|
    # uncomment if can't mount device from gui
    # vm.gui = true
    vm.memory = 512
    vm.cpus = 1
    vm.customize ["modifyvm", :id, "--usb", "on"]
    vm.customize ["modifyvm", :id, "--usbehci", "on"]
  end

  config.vm.provider "vmware_workstation" do |vm, override|
    vm.vmx["memsize"] = "512"
    vm.vmx["numvcpus"] = "1"
    vm.vmx["vmx.allowNested"] = "TRUE"
    vm.vmx["usb.present"] = "TRUE"
    vm.vmx["ehci.present"] = "TRUE"
  end

  config.vm.provider "hyperv" do |vm, override|
    override.vm.box = "ericmann/trusty64"
    override.vm.synced_folder ".", "/home/vagrant/toc",
      smb_username: ENV['SMB_USERNAME'],
      smb_password: ENV['SMB_PASSWORD']
  end
end
